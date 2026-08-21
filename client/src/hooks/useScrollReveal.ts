import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const activeSection = useRef<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targetsSelector =
      ".reveal-on-scroll, .reveal-stagger, .reveal, .reveal-hero, .reveal-bar, .timeline-item, .interest-card, .project-card, .research-ref-card, .cred-item, .cred-cert-item, .skill-group, .hero-stat-item, .stat-block";

    if (prefersReducedMotion) {
      document.querySelectorAll(targetsSelector).forEach((el) => {
        el.classList.add("in-view", "is-revealed");
      });
      return;
    }

    // ── 3D Scroll Reveal Observer ───────────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view", "is-revealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(targetsSelector).forEach((el) => revealObserver.observe(el));

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
          bar.style.transition = `height 0.75s cubic-bezier(0.23,1,0.32,1) ${i * 70}ms`;
          setTimeout(() => {
            bar.style.height = targetH;
          }, 50);
        });
        barObserver.unobserve(entry.target);
      });
    };

    const barObserver = new IntersectionObserver(animateBars, {
      threshold: 0.35,
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
