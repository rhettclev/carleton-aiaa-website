document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Scroll-reveal: fade/rise elements into view as the page is scrolled.
   Applied broadly here so every page gets it without per-page markup. */
(function () {
  const selectors = [
    '.hero .wrap > div', '.page-header .wrap', '.section-head',
    '.item-row', '.tier-card', '.comp-card', '.nav-tile', '.sponsor-card',
    '.fact', '.role', '.callout', '.dbf-feature', '.price-card',
    '.mission-steps li', '.budget-card', '.timeline-row', '.contact-card',
    '.cta-band .wrap > div', '.social-cta'
  ].join(', ');

  const targets = Array.from(document.querySelectorAll(selectors));
  if (!targets.length) return;

  // Stagger siblings within the same parent for a cascading effect.
  const counts = new Map();
  targets.forEach(el => {
    const parent = el.parentElement;
    const n = counts.get(parent) || 0;
    counts.set(parent, n + 1);
    el.classList.add('reveal');
    el.style.transitionDelay = Math.min(n * 70, 350) + 'ms';
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => io.observe(el));
})();
