// Mtech & Repairs Limited — site interactions

document.addEventListener('DOMContentLoaded', () => {

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('navToggle');
  if (navToggle && header) {
    navToggle.addEventListener('click', () => {
      const isOpen = header.classList.toggle('nav-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu after choosing a link (mobile)
    document.querySelectorAll('.main-nav a').forEach(link => {
      link.addEventListener('click', () => {
        header.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Contact form (demo — no backend wired up yet)
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      note.textContent = `Thanks${name ? ', ' + name : ''}! We\u2019ve got your request and will call you back shortly.`;
      form.reset();
    });
  }

});
