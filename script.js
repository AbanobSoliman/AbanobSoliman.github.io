// script.js

document.addEventListener("DOMContentLoaded", () => {
  // Update footer year
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Smooth scrolling for nav links
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", function(e) {
      if (this.hash !== "") {
        e.preventDefault();
        const targetEl = document.querySelector(this.hash);
        if (targetEl) {
          window.scrollTo({
            top: targetEl.offsetTop - document.querySelector("header").offsetHeight,
            behavior: "smooth"
          });
        }
      }
    });
  });
  
  // Intersection Observer for fade-in
  const faders = document.querySelectorAll(".fade-in");
  const options = {
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
  }, options);
  
  faders.forEach(el => {
    appearOnScroll.observe(el);
  });
});
