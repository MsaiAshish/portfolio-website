/* M. Sai Ashish — Portfolio (minimal). Vanilla JS. */
(function () {
  "use strict";

  /* Theme toggle (persisted) */
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const stored = (() => { try { return localStorage.getItem("theme"); } catch (e) { return null; } })();

  const applyTheme = (theme, save) => {
    root.dataset.theme = theme;
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (save) { try { localStorage.setItem("theme", theme); } catch (e) {} }
  };
  applyTheme(stored || (systemDark.matches ? "dark" : "light"), false);

  themeToggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true);
  });

  /* Mobile menu */
  const hamburger = document.getElementById("hamburger");
  const navList = document.getElementById("nav-list");

  const setMenu = (open) => {
    navList.classList.toggle("open", open);
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  hamburger.addEventListener("click", () => setMenu(!navList.classList.contains("open")));

  const navLinks = Array.from(navList.querySelectorAll(".nav__link"));
  navLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));

  /* Active nav link */
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + entry.target.id)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => spy.observe(s));

  /* Contact form */
  const form = document.getElementById("contact-form");
  const note = document.getElementById("contact-message");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let valid = true;
    form.querySelectorAll("input, textarea").forEach((field) => {
      const bad = !field.value.trim() ||
        (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value));
      field.closest(".form__group").classList.toggle("error", bad);
      if (bad) valid = false;
    });

    if (!valid) {
      note.textContent = "Fill in every field with a valid value.";
      return;
    }

    const data = new FormData(form);
    const body = `Name: ${data.get("name")}\nEmail: ${data.get("email")}\n\n${data.get("message")}`;
    window.location.href =
      "mailto:you@example.com?subject=" + encodeURIComponent(data.get("subject")) +
      "&body=" + encodeURIComponent(body);

    note.textContent = "Opening your email app.";
    form.reset();
  });

  form.querySelectorAll("input, textarea").forEach((field) =>
    field.addEventListener("input", () => field.closest(".form__group").classList.remove("error"))
  );

  /* Footer year */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
