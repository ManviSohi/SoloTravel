const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const overlay = document.getElementById("overlay");

menuToggle.addEventListener("click", () => {
  const isActive = menuToggle.classList.toggle("active");
  mobileMenu.classList.toggle("active", isActive);
  overlay.classList.toggle("active", isActive);
});

overlay.addEventListener("click", () => {
  menuToggle.classList.remove("active");
  mobileMenu.classList.remove("active");
  overlay.classList.remove("active");
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector("nav.navbar");
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
