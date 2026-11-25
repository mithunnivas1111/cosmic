/* ==========================================================================
   COSMIC — script.js
   Small, independent modules. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Header: translucent once the page scrolls ---------- */
  function initHeader() {
    var header = $('#site-header');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var toggle = $('#menu-toggle');
    var menu = $('#mobile-menu');
    var header = $('#site-header');
    if (!toggle || !menu) return;
    var label = $('.menu-toggle__label', toggle);
    var lastFocus = null;

    function open() {
      lastFocus = doc.activeElement;
      menu.hidden = false;
      // next frame so the transition runs
      requestAnimationFrame(function () { menu.classList.add('is-visible'); });
      toggle.setAttribute('aria-expanded', 'true');
      if (label) label.textContent = 'Close';
      header.classList.add('is-open');
      doc.body.style.overflow = 'hidden';
      var first = $('a', menu);
      if (first) first.focus({ preventScroll: true });
    }
    function close(restoreFocus) {
      menu.classList.remove('is-visible');
      toggle.setAttribute('aria-expanded', 'false');
      if (label) label.textContent = 'Menu';
      header.classList.remove('is-open');
      doc.body.style.overflow = '';
      var done = function () { if (toggle.getAttribute('aria-expanded') === 'false') menu.hidden = true; };
      if (reduceMotion.matches) done(); else setTimeout(done, 300);
      if (restoreFocus && lastFocus) lastFocus.focus({ preventScroll: true });
    }
    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? close(true) : open();
    });
    menu.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      var target = doc.getElementById((a.getAttribute('href') || '').slice(1));
      close(false);
      if (target) {
        // scroll after the body scroll-lock is released, so the jump isn't swallowed
        e.preventDefault();
        requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
          if (history.replaceState) history.replaceState(null, '', '#' + target.id);
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        });
      }
    });
    doc.addEventListener('keydown', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { close(true); return; }
      if (e.key === 'Tab') { // keep focus inside header + menu
        var focusables = [toggle].concat($$('a, button', menu));
        var first = focusables[0], last = focusables[focusables.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    window.matchMedia('(min-width: 1081px)').addEventListener('change', function (mq) {
      if (mq.matches && toggle.getAttribute('aria-expanded') === 'true') close(false);
    });
  }

  /* ---------- Scroll spy for primary nav ---------- */
  function initScrollSpy() {
    if (!hasIO) return;
    var links = $$('.nav__list a');
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    // sections that are not in the nav map onto the nearest nav item
    var alias = { different: 'problems', numbers: 'process', audit: 'process', categories: 'faq' };
    var sections = $$('main section[id]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = alias[entry.target.id] || entry.target.id;
        links.forEach(function (a) { a.removeAttribute('aria-current'); });
        if (map[id]) map[id].setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Hero entrance ---------- */
  function initHero() {
    var hero = $('.hero');
    if (!hero) return;
    $$('[data-hero]', hero).forEach(function (el, i) {
      var target = el.classList.contains('line') ? el.firstElementChild : el;
      target.style.setProperty('--delay', (120 + i * 110) + 'ms');
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { hero.classList.add('is-ready'); });
    });
  }

  /* ---------- Scroll reveals (staggered within a parent) ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!hasIO || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    items.forEach(function (el) {
      var siblings = $$(':scope > .reveal', el.parentElement);
      var idx = siblings.indexOf(el);
      if (idx > 0) el.style.setProperty('--delay', Math.min(idx, 6) * 70 + 'ms');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Comparison switch (mobile) ---------- */
  function initCompare() {
    $$('[data-compare]').forEach(function (box) {
      var tabs = $$('.compare__tab', box);
      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          box.setAttribute('data-view', tab.getAttribute('data-show'));
          tabs.forEach(function (t) { t.setAttribute('aria-pressed', String(t === tab)); });
        });
      });
    });
  }

  /* ---------- Services: highlight the service in view ---------- */
  function initServices() {
    var wrap = $('.services');
    if (!wrap || !hasIO) return;
    var panels = $$('.service', wrap);
    var links = $$('[data-svc-link]', wrap);
    var desktop = window.matchMedia('(min-width: 901px)');
    function setActive(id) {
      panels.forEach(function (p) { p.classList.toggle('is-active', p.id === id); });
      links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-svc-link') === id); });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    panels.forEach(function (p) { io.observe(p); });
    setActive(panels[0].id);
    function mode() { wrap.classList.toggle('is-tracking', desktop.matches); }
    desktop.addEventListener('change', mode);
    mode();
  }

  /* ---------- Growth orbit ---------- */
  function initOrbit() {
    var orbit = $('[data-orbit]');
    if (!orbit) return;
    var stages = $$('.stage', orbit);
    var nodes = $$('.orbit__node', orbit);
    var label = $('[data-orbit-label]', orbit);
    var names = ['Acquire', 'Convert', 'Track', 'Retain'];
    var userPicked = false;

    function setActive(i) {
      orbit.setAttribute('data-active', String(i));
      stages.forEach(function (s, n) {
        s.classList.toggle('is-active', n === i);
        $('.stage__btn', s).setAttribute('aria-pressed', String(n === i));
      });
      nodes.forEach(function (node, n) {
        node.classList.toggle('is-active', n === i);
        node.classList.toggle('is-done', n < i);
      });
      if (label) label.textContent = '0' + (i + 1) + ' ' + names[i];
    }
    stages.forEach(function (s, i) {
      var btn = $('.stage__btn', s);
      btn.addEventListener('click', function () { userPicked = true; setActive(i); });
      s.addEventListener('mouseenter', function () { setActive(i); });
      btn.addEventListener('focus', function () { setActive(i); });
    });
    // Follow the reader on scroll until they pick a stage themselves
    if (hasIO) {
      var io = new IntersectionObserver(function (entries) {
        if (userPicked) return;
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive(stages.indexOf(entry.target));
        });
      }, { rootMargin: '-45% 0px -45% 0px' });
      stages.forEach(function (s) { io.observe(s); });
    }
    setActive(0);
  }

  /* ---------- 90-day timeline: rail fills with scroll ---------- */
  function initTimeline() {
    var tl = $('[data-timeline]');
    if (!tl) return;
    var phases = $$('.phase', tl);
    var ticking = false;
    function update() {
      ticking = false;
      var rect = tl.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 when the timeline top reaches 80% of the viewport, 1 when its bottom reaches 55%
      var start = vh * 0.8, end = vh * 0.55;
      var p = (start - rect.top) / Math.max(1, (rect.height + start - end));
      p = Math.max(0, Math.min(1, p));
      tl.style.setProperty('--progress', p.toFixed(3));
      phases.forEach(function (ph, i) {
        var r = ph.getBoundingClientRect();
        ph.classList.toggle('is-reached', r.top < vh * 0.7);
      });
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- FAQ accordion (button + region, animated height) ---------- */
  function initAccordion() {
    $$('[data-accordion]').forEach(function (acc) {
      $$('.accordion__trigger', acc).forEach(function (btn) {
        var panel = doc.getElementById(btn.getAttribute('aria-controls'));
        btn.addEventListener('click', function () {
          var expanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', String(!expanded));
          if (reduceMotion.matches) { panel.hidden = expanded; return; }
          if (expanded) {
            panel.style.height = panel.scrollHeight + 'px';
            panel.classList.add('is-animating');
            requestAnimationFrame(function () { panel.style.height = '0px'; });
          } else {
            panel.hidden = false;
            panel.style.height = '0px';
            panel.classList.add('is-animating');
            requestAnimationFrame(function () { panel.style.height = panel.scrollHeight + 'px'; });
          }
          var onEnd = function (e) {
            if (e && e.propertyName !== 'height') return;
            panel.removeEventListener('transitionend', onEnd);
            panel.classList.remove('is-animating');
            panel.style.height = '';
            if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true;
          };
          panel.addEventListener('transitionend', onEnd);
        });
      });
      // Arrow-key movement between questions
      acc.addEventListener('keydown', function (e) {
        var triggers = $$('.accordion__trigger', acc);
        var i = triggers.indexOf(doc.activeElement);
        if (i < 0) return;
        var next = null;
        if (e.key === 'ArrowDown') next = triggers[(i + 1) % triggers.length];
        if (e.key === 'ArrowUp') next = triggers[(i - 1 + triggers.length) % triggers.length];
        if (e.key === 'Home') next = triggers[0];
        if (e.key === 'End') next = triggers[triggers.length - 1];
        if (next) { e.preventDefault(); next.focus(); }
      });
    });
  }

  /* ---------- Audit request form ----------
     Behaviour preserved from the original site: on a valid submit it opens the
     visitor's email app with a pre-filled message to the Cosmic inbox. Nothing
     is stored or sent by the page itself. */
  function initForm() {
    var form = $('#audit-form');
    if (!form) return;
    var TO = 'mithunnivas1111@gmail.com';
    var status = $('#form-status');

    var rules = {
      'f-name': function (v) { return v ? '' : 'Please enter your name.'; },
      'f-email': function (v) {
        if (!v) return 'Please enter your email.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'That email address doesn’t look right.';
      },
      'f-phone': function (v) {
        if (!v) return 'Please enter a phone or WhatsApp number.';
        return v.replace(/\D/g, '').length >= 7 ? '' : 'Please enter a full phone number.';
      },
      'f-brand': function (v) { return v ? '' : 'Please enter your brand name.'; },
      'f-website': function (v) {
        if (!v) return 'Please add your website or store link.';
        return /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}/i.test(v) ? '' : 'Please enter a link like yourbrand.com.';
      }
    };

    function check(id) {
      var input = doc.getElementById(id);
      var msg = rules[id](input.value.trim());
      var field = input.closest('.field');
      var err = $('[data-error-for="' + id + '"]', form);
      field.classList.toggle('has-error', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    }

    Object.keys(rules).forEach(function (id) {
      var input = doc.getElementById(id);
      input.addEventListener('blur', function () { if (input.value.trim() || input.getAttribute('aria-invalid')) check(id); });
      input.addEventListener('input', function () { if (input.getAttribute('aria-invalid') === 'true') check(id); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) {
        if (!check(id) && !firstBad) firstBad = doc.getElementById(id);
      });
      if (firstBad) {
        firstBad.focus();
        status.hidden = true;
        return;
      }
      var d = new FormData(form);
      var g = function (k) { return (d.get(k) || '').toString().trim(); };
      var body =
        'New audit request from the Cosmic website\n\n' +
        'Name: ' + g('name') + '\n' +
        'Email: ' + g('email') + '\n' +
        'Phone/WhatsApp: ' + g('phone') + '\n' +
        'Brand: ' + g('brand') + '\n' +
        'Website: ' + g('website') + '\n' +
        'Platform: ' + g('platform') + '\n' +
        'Monthly ad spend: ' + g('spend') + '\n' +
        'Needs help with: ' + g('need') + '\n\n' +
        'Message:\n' + g('message');
      var href = 'mailto:' + TO +
        '?subject=' + encodeURIComponent('Audit request from ' + g('brand')) +
        '&body=' + encodeURIComponent(body);

      var a = doc.createElement('a');
      a.href = href;
      doc.body.appendChild(a); a.click(); a.remove();

      status.hidden = false;
      status.innerHTML = '';
      status.appendChild(doc.createTextNode('Your email app should now open with your details filled in. Press send to finish. If nothing opened, email us directly at '));
      var link = doc.createElement('a');
      link.href = 'mailto:' + TO; link.textContent = TO;
      status.appendChild(link);
      status.appendChild(doc.createTextNode('.'));
    });
  }

  function init() {
    initHeader();
    initMenu();
    initScrollSpy();
    initHero();
    initReveal();
    initCompare();
    initServices();
    initOrbit();
    initTimeline();
    initAccordion();
    initForm();
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init);
  else init();
})();
