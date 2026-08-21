import { useEffect, useState } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailPosition, setTrailPosition] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState<"default" | "hover" | "view" | "drag">("default");
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    // Check if device supports fine hover (mouse)
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!mediaQuery.matches || prefersReducedMotion.matches) {
      setIsTouch(true);
      return;
    }
    setIsTouch(false);

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);

    // Dynamic hover detection on interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        "a, button, [role='button'], input, .project-card, .featured-project, .cred-item, .cred-cert-item, .hero-portrait-container"
      ) as HTMLElement | null;

      if (!interactive) {
        setCursorState("default");
        setCursorLabel("");
        return;
      }

      if (interactive.classList.contains("project-card") || interactive.classList.contains("featured-project")) {
        setCursorState("view");
        setCursorLabel(interactive.getAttribute("data-cursor-text") || "Explore");
      } else if (interactive.tagName.toLowerCase() === "a" || interactive.tagName.toLowerCase() === "button") {
        setCursorState("hover");
        setCursorLabel("");
      } else {
        setCursorState("hover");
        setCursorLabel("");
      }
    };

    document.addEventListener("mouseover", handleElementHover, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", handleElementHover);
    };
  }, [isVisible]);

  // Smooth lerp trailing position
  useEffect(() => {
    if (isTouch) return;

    let animId: number;
    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const animateTrail = () => {
      setTrailPosition((prev) => ({
        x: lerp(prev.x, position.x, 0.2),
        y: lerp(prev.y, position.y, 0.2),
      }));
      animId = requestAnimationFrame(animateTrail);
    };

    animId = requestAnimationFrame(animateTrail);
    return () => cancelAnimationFrame(animId);
  }, [position, isTouch]);

  if (isTouch || !isVisible) return null;

  return (
    <>
      {/* Precision Dot */}
      <div
        className={`custom-cursor-dot ${cursorState !== "default" ? "is-active" : ""}`}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
        aria-hidden="true"
      />

      {/* Trailing Ring & Dynamic Badge */}
      <div
        className={`custom-cursor-ring cursor-state-${cursorState}`}
        style={{
          transform: `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0)`,
        }}
        aria-hidden="true"
      >
        {cursorLabel && <span className="cursor-badge-text">{cursorLabel}</span>}
      </div>
    </>
  );
}
