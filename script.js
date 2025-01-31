// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Update footer year dynamically
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll(".navbar a");
  navLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      if (this.hash !== "") {
        e.preventDefault();
        const targetId = this.hash;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - document.querySelector(".navbar").offsetHeight,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // Fade in elements on scroll using Intersection Observer
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });
});
