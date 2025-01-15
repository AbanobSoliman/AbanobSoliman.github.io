// Update footer year dynamically
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Optional: Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    // Only smooth scroll for #anchor links
    if (link.getAttribute('href').startsWith('#')) {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70, // offset for sticky navbar
          behavior: 'smooth'
        });
      }
    }
  });
});
