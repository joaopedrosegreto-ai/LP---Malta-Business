/* ============================================================
   MALTA — interações
   GSAP + ScrollTrigger + Lenis (smooth scroll)
   ============================================================ */
(function () {
  // Fonts: activate the non-blocking stylesheet as soon as JS runs (CSP-safe, no inline onload)
  try { document.querySelectorAll('link[data-fontswap]').forEach(l => { l.media = 'all'; }); } catch (e) {}

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
    if (burger) burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
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
      gsap.from(el, {
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
    lps();
    grid();
    process();
    services();
    about();
    if (ScrollTrigger) ScrollTrigger.refresh();
  }

  let loaderStarted = false;
  const startOnce = () => { if (loaderStarted) return; loaderStarted = true; runLoader(boot); };
  window.addEventListener('load', startOnce);
  if (document.readyState === 'complete') startOnce();
  // final guarantee even if 'load' is delayed by assets
  setTimeout(startOnce, 3000);
})();
