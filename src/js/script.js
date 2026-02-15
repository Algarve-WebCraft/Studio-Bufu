"use strict";

document.addEventListener("DOMContentLoaded", () => {
  darkMode();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsapOpeningHomeAnimations();
});

/////////////////////////////////////////////////////////////* Opening hero intro animations *///////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  /* return; */

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2,
  });

  tl.fromTo(
    ".hero-background-image",
    { clipPath: "inset(0 50% 0 50%)" },
    {
      clipPath: "inset(0 0% 0 0%)",
      duration: 2.5,
      ease: "power3.out",
    },
  )
    .fromTo(
      ".hero-main-heading",
      {
        clipPath: "inset(0 0 100% 0)",
        transform: "translateY(-30px)",
      },
      {
        clipPath: "inset(0 0 -10% 0)",
        duration: 1.5,
        ease: "power3.inOut",
      },
      "-=1.2",
    )
    .from(
      ".header",
      {
        opacity: 0,
        y: -500,
        duration: 2,
      },
      "-=1",
    )
    .from(
      ".contact-section",
      {
        opacity: 0,
        y: 100,
        duration: 2,
      },
      "-=1",
    );
}

/////////////////////////////////////////////////////////////////* Dark-mode change */////////////////////////////////////////////////////////////////////////////////*

function darkMode() {
  const darkModeButton = document.getElementById("dark-mode-toggle");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyDarkMode() {
    document.documentElement.classList.add("dark-mode");
  }

  function applyLightMode() {
    document.documentElement.classList.remove("dark-mode");
  }

  function enableDarkMode() {
    applyDarkMode();
    localStorage.setItem("theme", "dark");
  }

  function disableDarkMode() {
    applyLightMode();
    localStorage.setItem("theme", "light");
  }

  function detectColorScheme() {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      storedTheme === "dark" ? applyDarkMode() : applyLightMode();
      return;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    prefersDark ? applyDarkMode() : applyLightMode();
  }

  detectColorScheme();

  function switchTheme(newTheme) {
    newTheme === "dark" ? enableDarkMode() : disableDarkMode();
  }

  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      e.matches ? applyDarkMode() : applyLightMode();
    }
  });

  darkModeButton.addEventListener("click", () => {
    const isPressed = darkModeButton.getAttribute("aria-pressed") === "true";
    darkModeButton.setAttribute("aria-pressed", String(!isPressed));

    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    if (!document.startViewTransition) {
      switchTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      switchTheme(newTheme);
    });
  });
}
