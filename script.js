document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
  
  // Smooth scrolling for navigation links
  document.querySelectorAll("nav a").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  
  // Toggle header visibility when "More" button is clicked
  const toggleHeaderBtn = document.getElementById("toggleHeaderBtn");
  const header = document.querySelector(".header");
  
  if (toggleHeaderBtn && header) {
    toggleHeaderBtn.addEventListener("click", () => {
      if (header.style.display === "block") {
        header.style.display = "none";
      } else {
        header.style.display = "block";
      }
    });
  }
  
  // Optional: Intersection Observer for fade-in animations (if you use it)
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
