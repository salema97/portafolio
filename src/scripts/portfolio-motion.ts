/** Parallax, scroll reveal, header state — respects prefers-reduced-motion */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initScrollProgress(): void {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  const update = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    bar.style.transform = `scaleX(${progress})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initHeaderScroll(): void {
  const header = document.getElementById("main-header");
  if (!header) return;

  const update = () => {
    header.classList.toggle("header-scrolled", window.scrollY > 24);
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initParallax(): void {
  const layers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax]")
  );
  if (!layers.length) return;

  let ticking = false;

  const update = () => {
    const scrollY = window.scrollY;
    for (const el of layers) {
      const speed = Number(el.dataset.parallax ?? "0.2");
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight * 0.5) * speed * 0.15;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update();
}

function markRevealed(el: Element): void {
  el.classList.add("is-revealed");
}

function revealInViewport(): void {
  const vh = window.innerHeight;

  document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)").forEach((el) => {
    const rect = el.getBoundingClientRect();
    const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
    if (visibleHeight <= 0) return;

    const ratio = visibleHeight / Math.max(rect.height, 1);
    if (ratio >= 0.04 || (rect.top < vh * 0.92 && rect.bottom > 0)) {
      markRevealed(el);
    }
  });
}

function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach(markRevealed);
    return;
  }

  document.querySelectorAll<HTMLElement>("#hero [data-reveal]").forEach(markRevealed);
  revealInViewport();

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          markRevealed(entry.target);
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "100px 0px 100px 0px", threshold: [0, 0.04, 0.1] }
  );

  items.forEach((el) => {
    if (!el.classList.contains("is-revealed")) {
      observer.observe(el);
    }
  });

  window.addEventListener("scroll", revealInViewport, { passive: true });
  window.addEventListener("resize", revealInViewport, { passive: true });
}

const SCROLL_SECTION_IDS = new Set([
  "main-content",
  "hero",
  "experience",
  "work",
  "skills",
  "certifications",
  "about",
  "contact",
]);

function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  return true;
}

function stripUrlHash(): void {
  if (!window.location.hash) return;
  const url = new URL(window.location.href);
  url.hash = "";
  history.replaceState(history.state, "", `${url.pathname}${url.search}`);
}

function initSectionScroll(): void {
  document.addEventListener("click", (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>("[data-scroll-to]");
    if (!trigger) return;

    const id = trigger.getAttribute("data-scroll-to");
    if (!id || !SCROLL_SECTION_IDS.has(id)) return;

    event.preventDefault();
    scrollToSection(id);
    stripUrlHash();
  });

  const initialHash = window.location.hash.slice(1);
  if (initialHash && SCROLL_SECTION_IDS.has(initialHash)) {
    requestAnimationFrame(() => {
      scrollToSection(initialHash);
      stripUrlHash();
    });
  }
}

function initMobileMenuEscape(): void {
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const menu = document.getElementById("mobile-menu");
    const btn = document.getElementById("mobile-menu-btn");
    if (menu && !menu.classList.contains("hidden")) {
      menu.classList.add("hidden");
      btn?.setAttribute("aria-expanded", "false");
      btn?.setAttribute("aria-label", "Open menu");
      document.getElementById("menu-icon-open")?.classList.remove("hidden");
      document.getElementById("menu-icon-close")?.classList.add("hidden");
    }
  });
}

function init(): void {
  initScrollProgress();
  initHeaderScroll();
  initSectionScroll();
  initReveal();
  initMobileMenuEscape();

  if (!prefersReducedMotion()) {
    initParallax();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
