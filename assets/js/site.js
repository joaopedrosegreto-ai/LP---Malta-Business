/* ============================================================
   MALTA BUSINESS · interações
   Sem dependências: header, menu, reveal, carrosséis, filtros,
   formulário → WhatsApp.
   ============================================================ */
(function () {
  'use strict';

  var WA_NUMBER = '553187637599';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fontes: ativa a folha não-bloqueante (CSP sem inline onload)
  document.querySelectorAll('link[data-fontswap]').forEach(function (l) { l.media = 'all'; });
  doc.classList.add('js');

  var yearEl = document.querySelectorAll('[data-year]');
  yearEl.forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Header: fundo ao rolar e esconde ao descer ---------- */
  var header = document.querySelector('.header');
  if (header) {
    var lastY = window.scrollY, ticking = false;
    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 24);
      var menuOpen = document.body.classList.contains('is-locked');
      header.classList.toggle('is-hidden', !menuOpen && y > 400 && y > lastY + 4);
      if (y < lastY - 4 || y < 400) header.classList.remove('is-hidden');
      lastY = y; ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });
    onScroll();
  }

  /* ---------- Menu mobile ---------- */
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    var closeBtn = menu.querySelector('.menu__close');
    var setMenu = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.inert = !open;
      document.body.classList.toggle('is-locked', open);
      if (open) { var first = menu.querySelector('nav a'); if (first) setTimeout(function () { first.focus(); }, 120); }
      else burger.focus();
    };
    burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
    if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { if (menu.classList.contains('is-open')) setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1000 && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealables = document.querySelectorAll('[data-reveal], .line-mask, [data-reveal-group]');
  if (!('IntersectionObserver' in window) || reduce) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    // stagger automático para filhos de [data-stagger]
    document.querySelectorAll('[data-stagger]').forEach(function (wrap) {
      var step = parseInt(wrap.getAttribute('data-stagger'), 10) || 70;
      Array.prototype.forEach.call(wrap.querySelectorAll(':scope > [data-reveal]'), function (el, i) {
        el.style.setProperty('--d', (i * step) + 'ms');
      });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Carrossel (scroll-snap + botões + dots + teclado) ---------- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var track = car.querySelector('.carousel__track');
    var slides = track.children;
    var total = slides.length;
    var prev = car.querySelector('[data-prev]');
    var next = car.querySelector('[data-next]');
    var count = car.querySelector('.carousel__count');
    var dotsWrap = car.querySelector('.carousel__dots');
    var label = car.getAttribute('aria-label') || 'Galeria';
    var current = 0;

    if (dotsWrap) {
      for (var i = 0; i < total; i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Foto ' + (i + 1) + ' de ' + total);
        (function (n) { b.addEventListener('click', function () { go(n); }); })(i);
        dotsWrap.appendChild(b);
      }
    }
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    function update(idx) {
      current = idx;
      if (count) count.textContent = pad(idx + 1) + ' / ' + pad(total);
      if (prev) prev.disabled = idx === 0;
      if (next) next.disabled = idx === total - 1;
      if (dotsWrap) Array.prototype.forEach.call(dotsWrap.children, function (d, n) {
        d.setAttribute('aria-current', n === idx ? 'true' : 'false');
      });
      Array.prototype.forEach.call(slides, function (s, n) {
        s.setAttribute('aria-hidden', n === idx ? 'false' : 'true');
      });
    }
    function go(idx) {
      idx = Math.max(0, Math.min(total - 1, idx));
      track.scrollTo({ left: slides[idx].offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      update(idx);
    }
    if (prev) prev.addEventListener('click', function () { go(current - 1); });
    if (next) next.addEventListener('click', function () { go(current + 1); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(current - 1); }
    });
    var raf = null;
    track.addEventListener('scroll', function () {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var idx = Math.round(track.scrollLeft / track.clientWidth);
        if (idx !== current) update(idx);
      });
    }, { passive: true });
    // arrastar com mouse no desktop
    var down = false, startX = 0, startLeft = 0, moved = false;
    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      track.style.scrollSnapType = 'none'; track.style.scrollBehavior = 'auto';
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      track.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', function (e) {
      if (!down) return;
      down = false;
      track.style.scrollSnapType = ''; track.style.scrollBehavior = '';
      var dx = e.clientX - startX;
      var target = current;
      if (dx < -50) target = current + 1; else if (dx > 50) target = current - 1;
      go(target);
    });
    track.addEventListener('click', function (e) { if (moved) { e.preventDefault(); moved = false; } }, true);
    track.setAttribute('tabindex', '0');
    track.setAttribute('aria-label', label + ' — use as setas para navegar');
    if (total < 2) { car.querySelectorAll('.carousel__nav, .carousel__dots').forEach(function (el) { el.hidden = true; }); }
    update(0);
  });

  /* ---------- Serviços: miniatura segue o cursor ---------- */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.svc__row').forEach(function (row) {
      row.addEventListener('mousemove', function (e) {
        var r = row.getBoundingClientRect();
        row.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        row.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ---------- Filtro de projetos web ---------- */
  var filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    var buttons = filterBar.querySelectorAll('.filter');
    var groups = document.querySelectorAll('[data-group]');
    var apply = function (key, push) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === key)); });
      groups.forEach(function (g) {
        var show = key === 'todos' || g.dataset.group === key;
        if (show && g.hidden) {
          g.hidden = false;
          g.classList.add('is-leaving');
          requestAnimationFrame(function () { requestAnimationFrame(function () { g.classList.remove('is-leaving'); }); });
          g.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
        } else if (!show && !g.hidden) {
          g.hidden = true;
        }
      });
      if (push && history.replaceState) {
        history.replaceState(null, '', key === 'todos' ? location.pathname : location.pathname + '#' + key);
      }
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.dataset.filter, true); });
    });
    var fromHash = function () {
      var key = (location.hash || '').replace('#', '');
      if (key && filterBar.querySelector('[data-filter="' + key + '"]')) apply(key, false);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
  }

  /* ---------- Formulário de contato → WhatsApp ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var submit = form.querySelector('button[type="submit"]');
    var fields = {
      nome: form.elements.nome,
      whatsapp: form.elements.whatsapp,
      email: form.elements.email,
      servico: form.elements.servico,
      mensagem: form.elements.mensagem
    };
    var digits = function (v) { return (v || '').replace(/\D/g, ''); };
    var maskPhone = function (v) {
      var d = digits(v).slice(0, 11);
      if (d.length <= 2) return d.length ? '(' + d : '';
      if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    };
    var rules = {
      nome: function (v) { return v.trim().length >= 2 ? '' : 'Digite seu nome (mínimo 2 letras).'; },
      whatsapp: function (v) { var n = digits(v).length; return (n === 10 || n === 11) ? '' : 'Informe um WhatsApp com DDD, ex.: (31) 98765-4321.'; },
      email: function (v) { return !v.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Esse e-mail parece incompleto.'; },
      servico: function (v) { return v ? '' : 'Escolha o que você precisa.'; },
      mensagem: function (v) { return v.trim().length >= 10 ? '' : 'Conte um pouco mais (mínimo 10 caracteres).'; }
    };
    var touched = {};
    var errorOf = function (name) { var el = fields[name]; return rules[name](el.value || ''); };
    var paint = function (name) {
      var el = fields[name];
      var wrap = el.closest('.field');
      var msg = errorOf(name);
      var show = touched[name] && msg;
      wrap.classList.toggle('is-invalid', !!show);
      el.setAttribute('aria-invalid', show ? 'true' : 'false');
      var out = wrap.querySelector('.field__err');
      if (out) out.textContent = show ? msg : '';
    };
    var validate = function () {
      var ok = Object.keys(rules).every(function (k) { return !errorOf(k); });
      submit.disabled = !ok;
      return ok;
    };
    fields.whatsapp.addEventListener('input', function () {
      var pos = fields.whatsapp.value.length;
      fields.whatsapp.value = maskPhone(fields.whatsapp.value);
      if (pos === fields.whatsapp.value.length) { /* mantém cursor no fim */ }
    });
    Object.keys(fields).forEach(function (k) {
      var el = fields[k];
      el.addEventListener('blur', function () { touched[k] = true; paint(k); });
      el.addEventListener('input', function () { if (touched[k]) paint(k); validate(); });
      el.addEventListener('change', function () { touched[k] = true; paint(k); validate(); });
    });
    // pré-seleciona serviço via ?servico=
    try {
      var qs = new URLSearchParams(location.search).get('servico');
      if (qs && fields.servico.querySelector('option[value="' + qs + '"]')) fields.servico.value = qs;
    } catch (e) {}
    validate();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      Object.keys(fields).forEach(function (k) { touched[k] = true; paint(k); });
      if (!validate()) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }
      var situacao = form.querySelector('input[name="situacao"]:checked');
      var lines = [
        'Olá, Malta! Vim pelo site e quero um orçamento.',
        '',
        '*Nome:* ' + fields.nome.value.trim(),
        '*WhatsApp:* ' + fields.whatsapp.value.trim()
      ];
      if (fields.email.value.trim()) lines.push('*E-mail:* ' + fields.email.value.trim());
      lines.push('*Preciso de:* ' + fields.servico.options[fields.servico.selectedIndex].text);
      if (situacao) lines.push('*Situação:* ' + situacao.value);
      lines.push('', '*Mensagem:*', fields.mensagem.value.trim());
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

      submit.disabled = true;
      submit.querySelector('span').textContent = 'Abrindo o WhatsApp…';
      try { sessionStorage.setItem('malta:wa', url); } catch (err) {}
      // sem 'noopener' na feature string: com ele o retorno é sempre null e não dá pra detectar bloqueio
      var win = window.open(url, '_blank');
      if (!win) { window.location.href = url; return; }
      try { win.opener = null; } catch (err) {}
      window.location.href = '/obrigado/';
    });
  }

  /* ---------- Página de obrigado: link de reenvio ---------- */
  var retry = document.querySelector('[data-wa-retry]');
  if (retry) {
    try {
      var saved = sessionStorage.getItem('malta:wa');
      if (saved && saved.indexOf('https://wa.me/' + WA_NUMBER) === 0) retry.href = saved;
    } catch (e) {}
  }
})();
