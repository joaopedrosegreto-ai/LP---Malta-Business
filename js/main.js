/* ============================================================
   MALTA — interações
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ============================================================ */
(function () {
  // Fonts: activate the non-blocking stylesheet as soon as JS runs (CSP-safe, no inline onload)
  try { document.querySelectorAll('link[data-fontswap]').forEach(l => { l.media = 'all'; }); } catch (e) {}

  // Vercel Web Analytics: fila de eventos até o script /_vercel/insights/script.js carregar
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Content-protection deterrents — active immediately (defined below, hoisted)
  try { protect(); } catch (e) {}
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- LOADER ---------- */
  function runLoader(done) {
    const loader = document.getElementById('loader');
    const bar = loader ? loader.querySelector('.loader__bar span') : null;
    let finished = false;
    const finish = () => { if (finished) return; finished = true; if (loader) loader.style.display = 'none'; done(); };
    // Hard safety net: never trap the site behind the loader (e.g. throttled rAF)
    const safety = setTimeout(finish, 2000);
    if (!loader || !gsap || reduce) { clearTimeout(safety); finish(); return; }
    gsap.timeline({ onComplete: finish })
      .to(bar, { width: '100%', duration: .8, ease: 'power2.inOut' })
      .to(loader, { yPercent: -100, duration: .7, ease: 'expo.inOut' }, '+=0.05');
  }

  /* ---------- LENIS smooth scroll ---------- */
  let lenis = null;
  function initLenis() {
    if (!window.Lenis || reduce) return;
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', () => ScrollTrigger && ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  // anchor links -> lenis
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      document.body.classList.remove('menu-open');
      if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
      else el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- CUSTOM CURSOR ---------- */
  function initCursor() {
    const cur = document.getElementById('cursor');
    if (!cur || matchMedia('(hover:none)').matches) { if (cur) cur.style.display = 'none'; return; }
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; });
    (function loop() {
      cx += (x - cx) * .18; cy += (y - cy) * .18;
      cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    const hoverables = '[data-cursor], a, button, .card, .srv, .step';
    document.querySelectorAll(hoverables).forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
    });
    document.addEventListener('mouseleave', () => cur.classList.add('is-hidden'));
    document.addEventListener('mouseenter', () => cur.classList.remove('is-hidden'));
  }

  /* ---------- NAV (hide on scroll down) ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const burger = document.getElementById('burger');
    if (burger) burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('#menu a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }));
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 40);
      if (y > last && y > 400 && !document.body.classList.contains('menu-open')) nav.classList.add('hidden');
      else nav.classList.remove('hidden');
      last = y;
    };
    (lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true }));
  }

  /* ---------- HERO intro ---------- */
  function heroIntro() {
    if (!gsap) return;
    if (reduce) { gsap.set('.hero__title .w', { y: 0 }); return; }
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from('.hero__top .eyebrow', { y: 20, opacity: 0, duration: .8, stagger: .1 })
      .to('.hero__title .w', { yPercent: 0, y: 0, duration: 1.2, stagger: .12 }, '-=0.4')
      .from('.hero__lead', { y: 24, opacity: 0, duration: .9 }, '-=0.7')
      .from('.hero__actions .btn', { y: 24, opacity: 0, duration: .7, stagger: .1 }, '-=0.6');
  }

  /* ---------- Line reveal for paragraphs / titles ---------- */
  function reveals() {
    if (!gsap) return;
    // Section titles: rise + fade (no overflow clip, so descenders like "g" are never cut)
    gsap.utils.toArray('.reveal-title').forEach(t => {
      if (reduce) return;
      const spans = t.querySelectorAll('span');
      gsap.from(spans, {
        scrollTrigger: { trigger: t, start: 'top 86%' },
        yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: .09
      });
    });
    gsap.utils.toArray('.reveal-lines').forEach(el => {
      if (reduce) return;
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: 26, opacity: 0, duration: 1, ease: 'expo.out'
      });
    });
  }

  /* ---------- STATEMENT: word by word highlight ---------- */
  function statement() {
    if (!gsap) return;
    const words = gsap.utils.toArray('.statement__text .word');
    if (!words.length) return;
    if (reduce) { gsap.set(words, { color: 'var(--white)' }); return; }
    gsap.to(words, {
      color: 'var(--white)', stagger: .5, ease: 'none',
      scrollTrigger: { trigger: '.statement', start: 'top 70%', end: 'bottom 70%', scrub: true }
    });
  }

  /* ---------- MARQUEE (infinite + scroll velocity) ---------- */
  function marquee() {
    const track = document.getElementById('marquee');
    if (!track || !gsap) return;
    const half = track.scrollWidth / 2;
    const x = gsap.to(track, { x: -half, duration: 22, ease: 'none', repeat: -1 });
    if (reduce) return;
    // react to scroll velocity
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-3, 3, self.getVelocity() / 300);
        gsap.to(x, { timeScale: 1 + Math.abs(v), overwrite: true, duration: .3 });
      }
    });
  }

  /* ---------- WORKS grid reveal ---------- */
  function grid() {
    if (!gsap) return;
    gsap.utils.toArray('.card').forEach((card) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 90%' },
        y: reduce ? 0 : 60, opacity: 0, duration: 1, ease: 'expo.out'
      });
    });
  }

  /* ---------- LANDING PAGES reveal ---------- */
  function lps() {
    if (!gsap) return;
    gsap.utils.toArray('.lp').forEach((el) => {
      el._rev = gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 88%' },
        y: reduce ? 0 : 70, opacity: 0, duration: 1.1, ease: 'expo.out'
      });
    });
  }

  /* ---------- PROCESS: horizontal pin on desktop, vertical stack on mobile ---------- */
  function process() {
    const track = document.getElementById('processTrack');
    const section = document.getElementById('servicos');
    if (!track || !gsap) return;
    const steps = gsap.utils.toArray('.step');

    // Mobile / reduced motion: vertical stack with a simple staggered reveal (coherent with the rest)
    if (reduce || matchMedia('(max-width:900px)').matches) {
      if (!reduce) {
        steps.forEach((s) => gsap.from(s, {
          scrollTrigger: { trigger: s, start: 'top 90%' },
          y: 40, opacity: 0, duration: .9, ease: 'expo.out'
        }));
      }
      return;
    }

    // Desktop: pinned horizontal scroll
    const getAmount = () => track.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(track).paddingLeft);
    gsap.to(track, {
      x: () => -getAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => '+=' + getAmount(),
        scrub: 1,
        pin: true,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });
  }

  /* ---------- SERVICES stagger ---------- */
  function services() {
    if (!gsap) return;
    gsap.from('.srv', {
      scrollTrigger: { trigger: '.services-list', start: 'top 85%' },
      y: reduce ? 0 : 30, opacity: 0, duration: .8, ease: 'expo.out', stagger: .08
    });
  }

  /* ---------- ABOUT photo parallax ---------- */
  function about() {
    if (!gsap || reduce) return;
    gsap.to('.about__photo img', {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- FAQ accordion (página /landing-page) ---------- */
  function faq() {
    const items = document.querySelectorAll('.faq__item');
    if (!items.length) return;
    items.forEach(item => {
      const q = item.querySelector('.faq__q');
      const a = item.querySelector('.faq__a');
      if (!q || !a) return;
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        items.forEach(it => { it.classList.remove('open'); const aa = it.querySelector('.faq__a'); if (aa) aa.style.height = '0px'; });
        if (!isOpen) { item.classList.add('open'); a.style.height = a.scrollHeight + 'px'; }
      });
    });
    window.addEventListener('resize', () => {
      const openA = document.querySelector('.faq__item.open .faq__a');
      if (openA) openA.style.height = openA.scrollHeight + 'px';
    });
  }

  /* ---------- SITES & LPs: filtro por categoria ---------- */
  function lpFilter() {
    const tabs = document.querySelectorAll('.lp-tab');
    const cards = Array.from(document.querySelectorAll('.lp-grid .lp'));
    if (!tabs.length || !cards.length) return;
    const layout = () => {
      const vis = cards.filter(c => !c.hidden);
      cards.forEach(c => c.classList.remove('is-full'));
      if (vis[0]) vis[0].classList.add('is-full');
      if (vis.length > 1 && (vis.length - 1) % 2 === 1) vis[vis.length - 1].classList.add('is-full');
    };
    const apply = (key, animate) => {
      tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.filter === key)));
      cards.forEach(c => { c.hidden = !(key === 'all' || c.dataset.cat === key); });
      layout();
      if (!animate) return;
      const vis = cards.filter(c => !c.hidden);
      vis.forEach(c => { if (c._rev) { if (c._rev.scrollTrigger) c._rev.scrollTrigger.kill(); c._rev.progress(1).kill(); c._rev = null; } });
      if (gsap && !reduce) gsap.fromTo(vis, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: .8, ease: 'expo.out', stagger: .06, clearProps: 'transform,opacity' });
      if (ScrollTrigger) ScrollTrigger.refresh();
    };
    tabs.forEach(t => t.addEventListener('click', () => apply(t.dataset.filter, true)));
    apply('all', false);
  }

  /* ---------- FOTOGRAFIA: carrossel (swipe nativo, setas, arrastar, teclado) ---------- */
  function carousels() {
    document.querySelectorAll('[data-carousel]').forEach(car => {
      const track = car.querySelector('.shoot__track');
      const slides = track.children;
      const total = slides.length;
      const prev = car.querySelector('[data-prev]');
      const next = car.querySelector('[data-next]');
      const count = car.querySelector('.shoot__count');
      const pad = n => String(n).padStart(2, '0');
      let current = 0;
      const update = i => {
        current = i;
        if (count) count.textContent = pad(i + 1) + ' / ' + pad(total);
        if (prev) prev.disabled = i === 0;
        if (next) next.disabled = i === total - 1;
      };
      const go = i => {
        i = Math.max(0, Math.min(total - 1, i));
        track.scrollTo({ left: slides[i].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
        update(i);
      };
      if (prev) prev.addEventListener('click', () => go(current - 1));
      if (next) next.addEventListener('click', () => go(current + 1));
      track.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
      });
      let raf = 0;
      track.addEventListener('scroll', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const i = Math.round(track.scrollLeft / track.clientWidth);
          if (i !== current) update(i);
        });
      }, { passive: true });
      // arrastar com mouse no desktop (no touch o swipe é nativo)
      let down = false, sx = 0, sl = 0;
      track.addEventListener('pointerdown', e => {
        if (e.pointerType !== 'mouse') return;
        down = true; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag');
      });
      window.addEventListener('pointermove', e => { if (down) track.scrollLeft = sl - (e.clientX - sx); });
      window.addEventListener('pointerup', e => {
        if (!down) return;
        down = false; track.classList.remove('is-drag');
        const dx = e.clientX - sx;
        go(dx < -50 ? current + 1 : dx > 50 ? current - 1 : current);
      });
      if (total < 2) car.querySelector('.shoot__btns').hidden = true;
      update(0);
    });
  }

  /* ---------- FOTOGRAFIA + FEEDBACKS: reveal ---------- */
  function shootsReveal() {
    if (!gsap) return;
    gsap.utils.toArray('.shoot, .fb').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: 'top 90%' },
        y: reduce ? 0 : 60, opacity: 0, duration: 1, ease: 'expo.out'
      });
    });
  }

  /* ---------- CONTATO: formulário -> WhatsApp ---------- */
  function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    const WA = '553187637599';
    const submit = form.querySelector('button[type="submit"]');
    const f = {
      nome: form.elements.nome, whatsapp: form.elements.whatsapp, email: form.elements.email,
      servico: form.elements.servico, mensagem: form.elements.mensagem
    };
    const digits = v => (v || '').replace(/\D/g, '');
    const mask = v => {
      const d = digits(v).slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
      if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    };
    const rules = {
      nome: v => v.trim().length >= 2 ? '' : 'Digite seu nome.',
      whatsapp: v => [10, 11].includes(digits(v).length) ? '' : 'Informe o WhatsApp com DDD.',
      email: v => !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Esse e-mail parece incompleto.',
      servico: v => v ? '' : 'Escolha uma opção.',
      mensagem: v => v.trim().length >= 10 ? '' : 'Conte um pouco mais (mínimo 10 caracteres).'
    };
    const touched = {};
    const err = k => rules[k](f[k].value || '');
    const paint = k => {
      const wrap = f[k].closest('.cfield');
      const msg = touched[k] ? err(k) : '';
      wrap.classList.toggle('is-invalid', !!msg);
      f[k].setAttribute('aria-invalid', msg ? 'true' : 'false');
      const out = wrap.querySelector('.cfield__err');
      if (out) out.textContent = msg;
    };
    const valid = () => { const ok = Object.keys(rules).every(k => !err(k)); submit.disabled = !ok; return ok; };
    f.whatsapp.addEventListener('input', () => { f.whatsapp.value = mask(f.whatsapp.value); });
    Object.keys(f).forEach(k => {
      f[k].addEventListener('blur', () => { touched[k] = true; paint(k); });
      f[k].addEventListener('input', () => { if (touched[k]) paint(k); valid(); });
      f[k].addEventListener('change', () => { touched[k] = true; paint(k); valid(); });
    });
    valid();
    form.addEventListener('submit', e => {
      e.preventDefault();
      Object.keys(f).forEach(k => { touched[k] = true; paint(k); });
      if (!valid()) { const bad = form.querySelector('[aria-invalid="true"]'); if (bad) bad.focus(); return; }
      const sit = form.querySelector('input[name="situacao"]:checked');
      const lines = ['Olá, Malta! Vim pelo site e quero um orçamento.', '',
        '*Nome:* ' + f.nome.value.trim(), '*WhatsApp:* ' + f.whatsapp.value.trim()];
      if (f.email.value.trim()) lines.push('*E-mail:* ' + f.email.value.trim());
      lines.push('*Preciso de:* ' + f.servico.value);
      if (sit) lines.push('*Situação:* ' + sit.value);
      lines.push('', '*Mensagem:*', f.mensagem.value.trim());
      const url = `https://wa.me/${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
      submit.disabled = true;
      submit.querySelector('span').textContent = 'Abrindo o WhatsApp…';
      try { sessionStorage.setItem('malta:wa', url); } catch (x) {}
      try { window.va('event', { name: 'formulario_contato', data: { servico: f.servico.value } }); } catch (x) {}
      // sem 'noopener' na feature string: com ele o retorno é sempre null e não dá pra detectar bloqueio
      const win = window.open(url, '_blank');
      if (!win) { window.location.href = url; return; }
      try { win.opener = null; } catch (x) {}
      window.location.href = 'obrigado/';
    });
  }

  /* ---------- OBRIGADO: reabrir a mensagem montada ---------- */
  function thanks() {
    const a = document.querySelector('[data-wa-retry]');
    if (!a) return;
    try { const u = sessionStorage.getItem('malta:wa'); if (u && u.indexOf('https://wa.me/553187637599') === 0) a.href = u; } catch (x) {}
  }

  /* ---------- MEDIÇÃO: cliques que levam ao WhatsApp (Vercel Web Analytics) ----------
     Eventos personalizados só aparecem no painel em planos Pro; as visitas aparecem em qualquer plano. */
  function trackClicks() {
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
      if (!a) return;
      const card = a.closest('.plan');
      const plano = a.dataset.plan || (card && card.querySelector('.plan__name') ? card.querySelector('.plan__name').textContent.trim() : '');
      const origem = a.dataset.track || (a.classList.contains('wa-float') ? 'whatsapp_flutuante' : 'whatsapp_link');
      try { window.va('event', { name: origem, data: { plano: plano || '-', pagina: location.pathname } }); } catch (x) {}
    }, true);
  }

  /* ---------- CONTENT / IMAGE PROTECTION (deterrents) ----------
     Nota: código front-end é sempre baixado pelo navegador; isto dificulta
     a cópia casual (salvar imagem, arrastar, "ver código fonte"), não é
     proteção absoluta. Para desligar, remova a chamada protect() no boot. */
  function protect() {
    // Bloqueia menu de contexto (botão direito) — dificulta "salvar imagem" e "ver fonte"
    document.addEventListener('contextmenu', e => e.preventDefault());
    // Impede arrastar imagens para a área de trabalho / outra aba
    document.addEventListener('dragstart', e => {
      if (e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
    // Dissuade atalhos de salvar página / ver fonte / devtools
    document.addEventListener('keydown', e => {
      const k = (e.key || '').toLowerCase();
      const cmd = e.ctrlKey || e.metaKey;
      if (cmd && (k === 's' || k === 'u' || k === 'p')) { e.preventDefault(); return; }
      if (cmd && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) { e.preventDefault(); return; }
      if (k === 'f12') e.preventDefault();
    });
  }

  /* ---------- YEAR ---------- */
  const yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- BOOT ---------- */
  let booted = false;
  function boot() {
    if (booted) return; booted = true;
    initLenis();
    initCursor();
    initNav();
    heroIntro();
    reveals();
    statement();
    marquee();
    lpFilter();
    lps();
    grid();
    carousels();
    shootsReveal();
    contactForm();
    trackClicks();
    thanks();
    process();
    services();
    about();
    faq();
    if (ScrollTrigger) ScrollTrigger.refresh();
  }

  let loaderStarted = false;
  const startOnce = () => { if (loaderStarted) return; loaderStarted = true; runLoader(boot); };
  window.addEventListener('load', startOnce);
  if (document.readyState === 'complete') startOnce();
  // final guarantee even if 'load' is delayed by assets
  setTimeout(startOnce, 3000);
})();
