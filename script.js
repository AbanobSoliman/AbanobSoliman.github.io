document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer (if applicable)
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

  // Make header visible when the green button is clicked
  const showHeaderBtn = document.getElementById("showHeaderBtn");
  if (showHeaderBtn) {
    showHeaderBtn.addEventListener("click", () => {
      document.querySelector(".header").style.display = "block";
    });
  }
  
  // Intersection Observer for fade-in (if used)
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
