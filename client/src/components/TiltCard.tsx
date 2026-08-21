import React, { useRef, useState, useEffect, type ReactNode, type HTMLAttributes } from "react";

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  maxTilt?: number; // max tilt angle in degrees
  perspective?: number; // perspective in px
  scale?: number; // scale on hover
  speed?: number; // transition duration in ms
  disabled?: boolean;
}

export function TiltCard({
  children,
  className = "",
  maxTilt = 6,
  perspective = 1000,
  scale = 1.015,
  speed = 400,
  disabled = false,
  style,
  ...rest
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchOrReducedMotion, setIsTouchOrReducedMotion] = useState(true);

  useEffect(() => {
    const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setIsTouchOrReducedMotion(isTouch || prefersReducedMotion);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || isTouchOrReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((centerY - y) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: "transform 100ms cubic-bezier(0.23, 1, 0.32, 1)",
    });
  };

  const handleMouseEnter = () => {
    if (disabled || isTouchOrReducedMotion) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (disabled || isTouchOrReducedMotion) return;
    setIsHovered(false);
    setTransformStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: `transform ${speed}ms cubic-bezier(0.23, 1, 0.32, 1)`,
    });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card ${isHovered ? "is-tilting" : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        ...(!isTouchOrReducedMotion ? transformStyle : {}),
        transformStyle: "preserve-3d",
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
