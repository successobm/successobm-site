/**
 * SuccessOBM — main.js
 *
 * Minimal, dependency-free JavaScript for:
 *   1. Mobile navigation toggle
 *   2. Sticky header scroll shadow
 *   3. FAQ accordion (accessible disclosure pattern)
 *   4. Dynamic copyright year
 *   5. Smooth scroll offset for sticky header
 */

(function () {
  'use strict';

  /* --------------------------------------------------
   * 1. Mobile Navigation Toggle
   * -------------------------------------------------- */
  const navToggle = document.querySelector('.nav__toggle');
  const navMenu   = document.querySelector('.nav__menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Prevent body scroll when menu is open
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navMenu.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', closeNav);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('is-open') &&
        !navToggle.contains(e.target) &&
        !navMenu.contains(e.target)
      ) {
        closeNav();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    function closeNav() {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  }


  /* --------------------------------------------------
   * 2. Sticky Header — scroll shadow
   * -------------------------------------------------- */
  const header = document.querySelector('.site-header');

  if (header) {
    const handleScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load in case page is loaded scrolled
  }


  /* --------------------------------------------------
   * 3. FAQ Accordion
   * Accessible disclosure: one open at a time.
   * Uses aria-expanded + hidden attribute.
   * -------------------------------------------------- */
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const answerId   = toggle.getAttribute('aria-controls');
      const answer     = document.getElementById(answerId);

      // Collapse all other items first
      faqToggles.forEach((other) => {
        if (other !== toggle) {
          other.setAttribute('aria-expanded', 'false');
          const otherId     = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Toggle current item
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      if (answer) answer.hidden = isExpanded;
    });
  });


  /* --------------------------------------------------
   * 4. Dynamic Copyright Year
   * -------------------------------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------
   * 5. Smooth scroll — offset for sticky header height
   * Intercepts anchor link clicks and adjusts scroll
   * position to account for the fixed header.
   * -------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop    = target.getBoundingClientRect().top + window.scrollY;
      const scrollTo     = targetTop - headerHeight - 16; // 16px extra breathing room

      window.scrollTo({ top: scrollTo, behavior: 'smooth' });

      // Update URL hash without jumping
      history.pushState(null, '', targetId);

      // Move focus to section for screen readers
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    });
  });

})();
