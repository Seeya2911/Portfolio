import { useRef, useState, useEffect, type ReactNode } from "react";

interface HeroPortrait3DProps {
  children: ReactNode;
  className?: string;
}

export function HeroPortrait3D({ children, className = "" }: HeroPortrait3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<string>("perspective(1200px) rotateX(0deg) rotateY(0deg)");
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOrReducedMotion, setIsTouchOrReducedMotion] = useState(true);

  useEffect(() => {
    const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTouchOrReducedMotion(isTouch || prefersReducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchOrReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxTilt = 7; // Max tilt in degrees
    const rotateX = ((centerY - y) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseEnter = () => {
    if (isTouchOrReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isTouchOrReducedMotion) return;
    setIsHovered(false);
    setTransform("perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  return (
    <div
      ref={containerRef}
      className={`hero-portrait-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: !isTouchOrReducedMotion ? transform : undefined,
        transition: isHovered
          ? "transform 0.12s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s var(--ease)"
          : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.4s var(--ease)",
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}
