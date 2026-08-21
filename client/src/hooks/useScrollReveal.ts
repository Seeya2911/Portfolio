import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const activeSection = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      // Make all reveal elements immediately visible
      document.querySelectorAll(
        ".reveal-on-scroll, .reveal-stagger, .reveal, .reveal-hero, .reveal-bar, .timeline-item, .interest-card"
      ).forEach((el) => {
        el.classList.add("in-view", "is-revealed");
      });
      return;
    }

    // ── Scroll Reveal Observer ─────────────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view", "is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );

    const revealTargets = document.querySelectorAll(
      ".reveal-on-scroll, .reveal-stagger, .reveal, .reveal-hero, .reveal-bar, .timeline-item, .interest-card"
    );
    revealTargets.forEach((el) => revealObserver.observe(el));

    // ── Active Navigation Section Spy ──────────────────────────────
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".desktop-nav a[href^='#']");
    const sectionIds = Array.from(navLinks).map((a) => a.getAttribute("href")!.slice(1));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (activeSection.current !== id) {
              activeSection.current = id;
              navLinks.forEach((a) => {
                const linkId = a.getAttribute("href")!.slice(1);
                a.classList.toggle("active-nav", linkId === id);
              });
            }
          }
        });
      },
      { threshold: 0.25, rootMargin: "-20% 0px -60% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // ── SGPI Bar Chart Animation ──────────────────────────────────
    const animateBars = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bars = entry.target.querySelectorAll<HTMLElement>(".sem-bar");
        bars.forEach((bar, i) => {
          const targetH = bar.getAttribute("data-target-h") || bar.style.height;
          bar.setAttribute("data-target-h", targetH);
          bar.style.height = "0px";
          bar.style.transition = `height 0.7s cubic-bezier(0.23,1,0.32,1) ${i * 60}ms`;
          setTimeout(() => {
            bar.style.height = targetH;
          }, 60);
        });
        barObserver.unobserve(entry.target);
      });
    };

    const barObserver = new IntersectionObserver(animateBars, {
      threshold: 0.4,
    });

    const semesterChart = document.querySelector(".semester-chart");
    if (semesterChart) barObserver.observe(semesterChart);

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
      barObserver.disconnect();
    };
  }, []);
}
