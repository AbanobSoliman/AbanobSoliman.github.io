// New script.js for smooth scrolling and theme toggle

document.addEventListener("DOMContentLoaded", () => {
  // Update footer year dynamically
  document.getElementById("year").textContent = new Date().getFullYear();

  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - document.querySelector(".header").offsetHeight,
            behavior: "smooth"
          });
        }
      }
    });
  });

  // Theme toggle (Light/Dark)
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      // Save preference
      if (document.body.classList.contains("light-mode")) {
        localStorage.setItem("theme", "light");
      } else {
        localStorage.setItem("theme", "dark");
      }
    });
    // Apply saved theme preference
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
    }
  }
});
