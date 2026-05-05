// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  hamburger.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offsetTop = target.offsetTop - 80; // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  });
});

// Navbar background on scroll
const navbar = document.querySelector(".navbar");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 80) {
    navbar.style.boxShadow =
      "0 1px 0 rgba(255,255,255,0.65), 0 12px 36px rgba(150, 100, 120, 0.09)";
  } else {
    navbar.style.boxShadow =
      "0 1px 0 rgba(255,255,255,0.65), 0 8px 32px rgba(72, 58, 66, 0.04)";
  }

  lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll(".section").forEach((section) => {
  section.style.opacity = "0";
  section.style.transform = "translateY(30px)";
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(section);
});

// Animate timeline items on scroll
const timelineObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateX(0)";
        }, index * 100);
      }
    });
  },
  {
    threshold: 0.2,
  }
);

document.querySelectorAll(".timeline-item").forEach((item) => {
  item.style.opacity = "0";
  item.style.transform = "translateX(-30px)";
  item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  timelineObserver.observe(item);
});

// Animate project cards on scroll
const projectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }, index * 150);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document
  .querySelectorAll(".project-card, .leadership-card, .skill-category")
  .forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(28px)";
    card.style.transition = "opacity 0.65s ease, transform 0.65s ease";
    projectObserver.observe(card);
  });

// Add active state to navigation links based on scroll position
const sections = document.querySelectorAll(".section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 150) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Subtle parallax on hero (no fade-out — keeps content readable)
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");
  if (hero && scrolled < window.innerHeight) {
    hero.style.transform = `translateY(${scrolled * 0.22}px)`;
    hero.style.opacity = "1";
  }
});

// Add hover effect to skill tags
document.querySelectorAll(".tag").forEach((tag) => {
  tag.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-3px) scale(1.05)";
  });

  tag.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// Form validation (if contact form is added later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Console message
console.log(
  "%c👋 Hello! Thanks for checking out my portfolio!",
  "color: #C98A8F; font-size: 16px; font-weight: bold;"
);
console.log(
  "%cBuilt with ❤️ by Shayna John",
  "color: #E8B4B8; font-size: 12px;"
);
