"use strict";
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";

// Load all functions in as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  runSwupHooks();
  activateHamburgerMenu();
  updateActiveNavLink();
  resetHomeLoadedClass();
  darkMode();
  updateCopyrightYear();
  stopTransitionOnResize();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsapOpeningHomeAnimations();

  // Ensure Scroll Triggers wait until everything has fully loaded in.
  window.addEventListener("load", () => {
    setTimeout(() => {
      requestAnimationFrame(() => {
        gsapScrollAnimations();
        ScrollTrigger.refresh();
      });
    }, 100);
  });

  //Keep commented out while working as page bounces around on every refresh.
  /* document.documentElement.classList.add("has-smooth-scroll"); */
});

///////////////////////////////////////////////////////////* Swup page navigation *////////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup({
  containers: ["#swup", "#swup-header", "#footer"],
  animateHistoryBrowsing: true,
  respectScroll: false,

  plugins: [
    new SwupHeadPlugin({
      awaitAssets: true,
      persistAssets: false,
    }),
  ],
});

function runSwupHooks() {
  swup.hooks.on("page:view", () => {
    activateHamburgerMenu();
    updateActiveNavLink();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsapScrollAnimations();
  });

  // Prevents the browser from smooth scrolling when changing pages, only happens when still on the same page.
  swup.hooks.on("visit:start", () => {
    document.documentElement.classList.remove("has-smooth-scroll");
  });

  swup.hooks.on("visit:end", () => {
    document.documentElement.classList.add("has-smooth-scroll");
  });
}

/////////////////////////////////////////////////////////////* Opening hero intro animations *///////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  const body = document.body;
  const heroHeading = document.querySelector(".cmp-hero-heading");

  // Use isMobile to set different animation timings depending on screen size. Use this in place of timing - `${isMobile.matches ? "-=5.5" : "-=4.2"}`
  const isMobile = window.matchMedia("(max-width: 62.5rem)");

  if (!document.body.classList.contains("home")) return;

  // NB!!! Be careful that Swup animations are not conflicting with the opening animations, such as opacity not working properly because of 'fade-in' transition class.
  // Use onComplete() to add the animation classs back in after that specific animation is finished.

  return;

  // Snaps to the top of the screen when the home page is loaded.
  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  });

  // Prevents the user from being able to scroll while opening animatons are running. Change to 'auto', in an onComplete() during an animation.
  if (body.classList.contains("home")) {
    document.documentElement.style.overflow = "hidden";
  }

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2,
  });

  tl.fromTo(
    ".cmp-hero-section__image",
    {
      clipPath: "inset(0 0 100% 0)",
      transform: "translateY(-30px)",
    },
    {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.2,
      ease: "power3.inOut",
    },
  )
    .to(
      ".cmp-hero-section__image",
      {
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.inOut",
      },
      0,
    )
    .from(
      ".cmp-hero-heading",
      {
        opacity: 0,
        x: -150,
        duration: 1.5,
        // Use onComplete() after an animation to do anything required afterwards. Allows for more complex changes and state changes not related to animations.
        onComplete() {
          const images = document.querySelectorAll(".hero__image-main");

          document.documentElement.style.overflow = "auto";

          images.forEach((image) => {
            image.classList.add("slide-in-elliptic");
            gsap.set(".hero__image-main", { clearProps: "all" }); // Use clearProps to ensure no styles remain after the animation is finished (if there is an issue).
          });
        },
      },
      "+=0.2",
    )
    .from(
      ".header",
      {
        y: -30,
        opacity: 0,
        duration: 2,
      },
      "-=1",
    )
    .from(
      ".hero-flex__inner-flex",
      {
        opacity: 0,
        y: 100,
        duration: 2,
      },
      "-=1.75",
    );
}

// Ensures opening animations cannot run if not on the homepage.
function resetHomeLoadedClass() {
  if (!document.body.classList.contains("home")) {
    document.body.classList.add("loaded");
    return;
  }
}

////////////////////////////////////////////////////////////* GSAP scrolling animations *////////////////////////////////////////////////////////////////////////////////*

function gsapScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  return;

  ScrollTrigger.refresh();

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 1000);

  ScrollTrigger.defaults({ markers: true }); // Enable markers to show where the scroller starts and ends while planning

  const animatedElements = document.querySelectorAll(
    "[data-animate]:not([data-animate-group] [data-animate])",
  );

  /* Add 'data-animate' to the elements you want to animate from the list below ie. data-animate="slide-up". */
  /* Add 'data-reversible' to the elements you want to reverse the animation when scrolling back up. */
  /* Add 'data-scrub' to make the elements slowly scrub in with the scroller instead of popping in as the trigger is hit. */

  // Individual scroll animations (each element controlled by its own trigger).
  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    const isReversible = el.hasAttribute("data-reversible");
    const addScrub = el.hasAttribute("data-scrub");
    let animationStyles = { opacity: 0, duration: 1, ease: "power4.out" };

    switch (animationType) {
      case "slide-up":
        animationStyles = { ...animationStyles, y: 150 };
        break;
      case "slide-down":
        animationStyles = { ...animationStyles, y: -150 };
        break;
      case "slide-left":
        animationStyles = { ...animationStyles, x: -150 };
        break;
      case "slide-right":
        animationStyles = { ...animationStyles, x: 150 };
        break;
      case "slide-up-fast":
        animationStyles = { ...animationStyles, y: 150, duration: 0.2 };
        break;
      case "slide-down-fast":
        animationStyles = { ...animationStyles, y: -150, duration: 0.2 };
        break;
      case "slide-left-fast":
        animationStyles = { ...animationStyles, x: -150, duration: 0.2 };
        break;
      case "slide-right-fast":
        animationStyles = { ...animationStyles, x: 150, duration: 0.2 };
        break;
      case "fade-in":
      default:
        animationStyles = { ...animationStyles, duration: 1 };
        break;
      case "bg-move": // Unveil from left to right.
        animProps = {
          ...animProps,
          clipPath: "inset(0 100% 0 0)",
          opacity: 1,
          duration: 1.5,
        };
        break;
      case "scale-up": // Scale down to look like its coming up from within.
        animProps = { ...animProps, scale: 0.85, duration: 1.5 };
        break;
      case "scale-down": // Scale down to look like its arriving on the page.
        gsap.from(el, {
          scale: 2,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform, opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 0%",
          },
        });
        return;
      case "shutter-horizontal": // Open from horizontal middle outwards, good for images.
        gsap.fromTo(
          el,
          { clipPath: "inset(0 50% 0 50%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.25,
            ease: "power3.out",
            clearProps: "transform, opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 65%",
            },
          },
        );
        return;
      case "shutter-vertical": // Open from vertical middle outwards.
        gsap.fromTo(
          el,
          { clipPath: "inset(50% 0 50% 0)" },
          {
            clipPath: "inset(-10% -10% -10% -10%)",
            duration: 2.5,
            ease: "power3.out",
            clearProps: "transform, opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
            },
          },
        );
        return;
    }

    // Generic function handles the default 'from' animations if they are not specified in the switch above.
    gsap.from(el, {
      ...animationStyles,
      clearProps: "transform, opacity",
      scrollTrigger: {
        trigger: el,
        start: "top 50%",
        end: "top 45%",
        scrub: addScrub ? 5 : false, // Change number to increase or decrease the speed of the scrub when added.
        once: isReversible ? false : true,
        toggleActions: isReversible
          ? "play none none reverse"
          : "play none none none",
      },
    });
  });

  // Group scroll animations (multiple elements controlled by a single trigger).
  document.querySelectorAll("[data-animate-group]").forEach((group) => {
    // Add 'data-animate-start="top 60%"' to the html element next to 'data-animate-group' to set whatever specific start point for that group, defaults to "top 40%".
    const triggerStartPoint = group.dataset.animateStart || "top 40%";

    group.querySelectorAll("[data-animate]").forEach((el) => {
      const animationType = el.dataset.animate;
      let animationStyles = { opacity: 0, ease: "power4.out" };

      switch (animationType) {
        case "slide-left":
          animationStyles.x = -120;
          break;
        case "slide-right":
          animationStyles.x = 120;
          break;
        case "slide-up":
          animationStyles.y = 120;
          break;
        case "slide-down":
          animationStyles.y = -120;
          break;
      }

      // 'set' ensures the beginning styles are applied straight away so they can be animated to. Required to make group animations work as just 'from' does not work.
      gsap.set(el, animationStyles);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: triggerStartPoint,
        once: true,
      },
    });

    group.querySelectorAll("[data-animate]").forEach((el) => {
      tl.to(
        el,
        {
          x: 0,
          y: 0,
          opacity: 1,
          ease: "power4.out",
          duration: 1,
        },
        0,
      );
    });
  });
}

////////////////////////////////////////////////////////* Performance section scroll animation *////////////////////////////////////////////////////////////////////////*

//////////////////////////////////////////////////////////////////* Testimonial Carousel */////////////////////////////////////////////////////////////////////////////*

//////////////////////////////////////////////////////////* Our services page heading underline draw *//////////////////////////////////////////////////////////////////*

////////////////////////////////////////////////////* Hamburger menu and Navigation accessibility attributes */////////////////////////////////////////////////////////*

function activateHamburgerMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navBar = document.querySelector(".nav-bar");
  const navBarList = document.querySelector(".nav-bar ul");
  let isAnimating = false;

  hamburgerBtn.addEventListener("click", () => {
    if (isAnimating) return;
    const isOpen = navBar.classList.contains("hamburger-btn__open");

    if (isOpen) {
      isAnimating = true;
      hamburgerBtn.classList.remove("active");
      navBar.classList.remove("hamburger-btn__open");
    } else {
      navBar.style.display = "block";
      requestAnimationFrame(() => {
        isAnimating = true;
        hamburgerBtn.classList.add("active");
        navBar.classList.add("hamburger-btn__open");
      });
    }

    setNavAttributes();

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  });

  navBar.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    isAnimating = false;
  });

  document.addEventListener("click", (e) => {
    if (
      !navBar.classList.contains("hamburger-btn__open") ||
      e.target === navBar ||
      e.target === hamburgerBtn ||
      e.target === navBarList
    )
      return;

    isAnimating = true;
    navBar.classList.remove("hamburger-btn__open");
    hamburgerBtn.classList.remove("active");

    setNavAttributes();
  });
}

function setNavAttributes() {
  const navBar = document.querySelector(".nav-bar");
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const navBarHasActiveClass = navBar.classList.contains("hamburger-btn__open");
  const hamburgerBtn = document.querySelector(".hamburger-btn");

  if (!navBarHasActiveClass && navBar.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  navBar.setAttribute("aria-hidden", String(!navBarHasActiveClass));
  hamburgerBtn.setAttribute("aria-expanded", String(navBarHasActiveClass));

  navBarLinks.forEach((link) => {
    link.tabIndex = navBarHasActiveClass ? 0 : -1;
  });
}

//////////////////////////////////////////////////////////////////* Show the current page on nav-bar *////////////////////////////////////////////////////////////////*

function updateActiveNavLink() {
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const currentPath = window.location.pathname;

  for (const link of navBarLinks) {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath || currentPath === "/") {
      link.classList.add("active-link");

      requestAnimationFrame(() => {
        link.classList.add("animate-underline");
      });

      break; // Break the loop so only the homepage link has the active-link class.
    } else {
      link.classList.remove("active-link", "animate-underline");
    }
  }
}

///////////////////////////////////////////////////////////////* Sticky navigation bar *//////////////////////////////////////////////////////////////////////////////*

function initStickyHeader() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navBar = document.querySelector(".nav-bar");

  function closeMenuSafely() {
    navBar.classList.remove("hamburger-btn__open");
    hamburgerBtn.classList.remove("active");
    setNavAttributes();
  }

  window.addEventListener("scroll", () => {
    const header = document.querySelector("#header");
    const isScrolled = window.scrollY > 400;
    const headerWasSticking = header.classList.contains("sticking");

    if (isScrolled && !headerWasSticking) {
      header.classList.add("sticking");
      closeMenuSafely();
    } else if (window.scrollY === 0 && headerWasSticking) {
      header.classList.remove("sticking");
      closeMenuSafely();
    }
  });
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

//////////////////////////////////////////////////////////////* Footer copyright-year update *////////////////////////////////////////////////////////////////////////*

function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightSymbol = "\u00A9";

  /* document.getElementById(
    "year"
  ).innerHTML = `<strong>${copyrightSymbol} Copyright ${currentYear}</strong>`; */
}

////////////////////////////////////////////////////////* Prevent navigation transitions happening on resize *////////////////////////////////////////////////////////////////////////*

function stopTransitionOnResize() {
  const navBar = document.querySelector(".nav-bar");
  let resizeTimeout;

  window.addEventListener("resize", () => {
    navBar.classList.add("no-transition");

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      navBar.classList.remove("no-transition");
    }, 1);
  });
}
