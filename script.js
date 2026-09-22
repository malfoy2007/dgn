/* ===== Divya Gyan Niketan — Site Scripts (vanilla JS, efficient) ===== */
(() => {
  'use strict';

  /* ---- Sticky navbar shadow on scroll ---- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu toggle ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- Scroll reveal (IntersectionObserver — no layout thrash) ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('.stat-num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      counterIO.unobserve(el);
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterIO.observe(el));

  /* ---- Enquiry form validation (client-side, friendly) ---- */
  const form = document.getElementById('enquiryForm');
  const errEl = document.getElementById('formError');
  const okEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errEl.textContent = '';
    okEl.textContent = '';

    const name = document.getElementById('parentName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const cls = document.getElementById('classSelect').value;

    if (!name || !phone || !cls) {
      errEl.textContent = 'Please fill in Parent\'s Name, Phone Number and Class.';
      return;
    }
    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
      errEl.textContent = 'Please enter a valid phone number (10–15 digits).';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // No backend configured — simulate a send, then open mailto as a real fallback
    setTimeout(() => {
      const facility = document.getElementById('facility').value || 'Not specified';
      const msg = document.getElementById('message').value.trim();
      const subject = encodeURIComponent(`Admission Enquiry — ${cls}`);
      const body = encodeURIComponent(
        `Parent's Name: ${name}\nPhone: ${phone}\nClass: ${cls}\nFacility: ${facility}\nMessage: ${msg || '—'}`
      );
      window.location.href = `mailto:Divyagyanniketan@gmail.com?subject=${subject}&body=${body}`;
      okEl.textContent = 'Thank you! Your enquiry has been noted — we will contact you soon.';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Enquiry';
    }, 700);
  });

  /* ---- Footer year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
