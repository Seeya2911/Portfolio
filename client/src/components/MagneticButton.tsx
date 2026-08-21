import { useRef, useState, useEffect, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "a" | "button";
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.32,
  as: Tag = "button",
  href,
  target,
  rel,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsTouch(!mq.matches || rm.matches);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (isTouch || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition: offset.x === 0 && offset.y === 0
      ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)"
      : "transform 0.15s cubic-bezier(0.23,1,0.32,1)",
  };

  const props: Record<string, unknown> = {
    ref,
    className,
    style,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
  };

  if (Tag === "a") {
    props.href = href;
    props.target = target;
    props.rel = rel;
  }

  return <Tag {...(props as any)}>{children}</Tag>;
}
