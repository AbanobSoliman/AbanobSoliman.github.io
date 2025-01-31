// Initialize Typed.js and smooth scroll, plus fade-in observer

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Smooth scrolling for navigation links
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
  
  // Initialize Typed.js for typewriter effect in hero
  if (typeof Typed !== "undefined") {
    new Typed("#typed", {
      strings: ["ADAS Algorithm Engineer", "Ph.D. in Signal & Image Processing", "Postdoctoral Researcher at the University of Twente (Feb 2025)"],
      typeSpeed: 50,
      backSpeed: 30,
      loop: true
    });
  }
  
  // Fade in on scroll using Intersection Observer
  const faders = document.querySelectorAll(".fade-in");
  const appearOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        obs.unobserve(entry.target);
      }
    });
  }, appearOptions);
  
  faders.forEach(el => {
    observer.observe(el);
  });
});
