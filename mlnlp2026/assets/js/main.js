/**
 * MLNLP 2025 navigation and gallery.
 * Based on TheEvent by BootstrapMade (https://bootstrapmade.com/license/).
 */
(() => {
  'use strict';
  const header = document.querySelector('#header');
  const navbar = document.querySelector('#navbar');
  const toggle = document.querySelector('.mobile-nav-toggle');
  const toTop = document.querySelector('.back-to-top');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const navLinks = Array.from(navbar.querySelectorAll('a[href^="#"]'));
  function closeMenu() {
    navbar.classList.remove('navbar-mobile');
    toggle.classList.replace('bi-x', 'bi-list');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开导航菜单');
  }
  toggle.addEventListener('click', () => {
    const open = navbar.classList.toggle('navbar-mobile');
    toggle.classList.toggle('bi-list', !open);
    toggle.classList.toggle('bi-x', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navbar.classList.contains('navbar-mobile')) {
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!navbar.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 992px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
  function updateNavigation() {
    header.classList.toggle('header-scrolled', window.scrollY > 24);
    toTop.classList.toggle('active', window.scrollY > 400);
    let current = navLinks[0];
    for (const link of navLinks) {
      const section = document.getElementById(link.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= header.offsetHeight + 100) current = link;
    }
    for (const link of navLinks) {
      link.classList.toggle('active', link === current);
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { updateNavigation(); scheduled = false; });
  }, { passive: true });
  window.addEventListener('load', updateNavigation);
  updateNavigation();
  document.querySelectorAll('.scrollto, .back-to-top').forEach(link => {
    link.addEventListener('click', event => {
      if (!link.hash || link.origin !== window.location.origin || link.pathname !== window.location.pathname) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      event.preventDefault();
      closeMenu();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 16,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
      history.replaceState(null, '', link.hash);
    });
  });
  if (window.Swiper) {
    new Swiper('.gallery-slider', {
      speed: reducedMotion.matches ? 0 : 400,
      slidesPerView: 1,
      spaceBetween: 20,
      watchOverflow: true,
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      a11y: { enabled: true, paginationBulletMessage: '前往第 {{index}} 组活动' },
      keyboard: { enabled: true, onlyInViewport: true },
      breakpoints: { 575: { slidesPerView: 2 }, 992: { slidesPerView: 3, spaceBetween: 24 } }
    });
  }
  // Decorative animations must never prevent access to content.
  if (window.AOS && !reducedMotion.matches) {
    AOS.init({ duration: 500, easing: 'ease-out', once: true, offset: 30 });
  } else {
    document.querySelectorAll('[data-aos]').forEach(element => element.removeAttribute('data-aos'));
  }
})();
