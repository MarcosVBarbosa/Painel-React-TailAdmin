// src/components/Tooltip/Tooltip.tsx
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Placement = "top" | "right" | "bottom" | "left";

interface TooltipProps {
  text: string;
  children: ReactNode;
  placement?: Placement;
  delay?: number;
  autoFlip?: boolean;
  className?: string;
}

export default function Tooltip({
  text,
  children,
  placement = "top",
  delay = 80,
  autoFlip = true,
  className = "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
}: TooltipProps) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null,
  );
  const [finalPlacement, setFinalPlacement] = useState<Placement>(placement);

  const enterTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);
  const margin = 10;

  const computePosition = (p: Placement) => {
    if (!triggerRef.current) return null;
    const r = triggerRef.current.getBoundingClientRect();
    switch (p) {
      case "top":
        return { top: r.top - margin, left: r.left + r.width / 2 };
      case "bottom":
        return { top: r.bottom + margin, left: r.left + r.width / 2 };
      case "left":
        return { top: r.top + r.height / 2, left: r.left - margin };
      case "right":
        return { top: r.top + r.height / 2, left: r.right + margin };
    }
  };

  const fitsOnScreen = (p: Placement) => {
    const c = computePosition(p);
    if (!c) return false;
    const padding = 12,
      estW = 220,
      estH = 36;
    const { innerWidth: vw, innerHeight: vh } = window;
    if (p === "top") return c.top - estH >= padding;
    if (p === "bottom") return c.top + estH <= vh - padding;
    if (p === "left") return c.left - estW >= padding;
    if (p === "right") return c.left + estW <= vw - padding;
    return true;
  };

  useEffect(() => {
    if (!visible) return;
    let chosen = placement;
    if (autoFlip && !fitsOnScreen(placement)) {
      const order: Placement[] =
        placement === "top"
          ? ["bottom", "right", "left"]
          : placement === "bottom"
            ? ["top", "right", "left"]
            : placement === "left"
              ? ["right", "top", "bottom"]
              : ["left", "top", "bottom"];
      for (const alt of order)
        if (fitsOnScreen(alt)) {
          chosen = alt;
          break;
        }
    }
    setFinalPlacement(chosen);
    setCoords(computePosition(chosen) ?? null);
  }, [visible, placement, autoFlip]);

  useEffect(() => {
    if (!visible) return;
    const handle = () => setCoords(computePosition(finalPlacement) ?? null);
    window.addEventListener("scroll", handle, true);
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle, true);
      window.removeEventListener("resize", handle);
    };
  }, [visible, finalPlacement]);

  const handleMouseEnter = () => {
    if (leaveTimer.current) window.clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => setVisible(true), delay);
  };
  const handleMouseLeave = () => {
    if (enterTimer.current) window.clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => setVisible(false), delay);
  };

  // Base mínima para layout/legibilidade (pode ser sobreposta pelas suas classes)
  const baseBubble =
    "whitespace-nowrap rounded-md px-2.5 py-2.5 text-xs font-medium shadow-lg ring-1 transition-opacity duration-100 ease-out";

  // Fallback dark MUITO discreto, caso nenhum className seja passado
  const fallbackDark =
    "bg-gray-900/95 text-gray-50 ring-black/10 " +
    "dark:bg-[#111827]/95 dark:text-gray-100 dark:ring-white/10";

  const bubbleClasses = `${baseBubble} ${className || fallbackDark}`;

  const wrapperStyle: React.CSSProperties = {
    top: coords?.top,
    left: coords?.left,
    transform:
      finalPlacement === "top"
        ? "translate(-50%, -100%)"
        : finalPlacement === "bottom"
          ? "translate(-50%, 0)"
          : finalPlacement === "left"
            ? "translate(-100%, -50%)"
            : "translate(0, -50%)",
  };

  const trigger = (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-describedby={visible ? "tooltip" : undefined}
    >
      {children}
    </div>
  );

  const bubble =
    visible && coords
      ? createPortal(
          <div
            className="fixed z-[9999] pointer-events-none select-none"
            style={wrapperStyle}
          >
            <div
              id="tooltip"
              role="tooltip"
              className={`${bubbleClasses} opacity-100`}
            >
              {text}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {trigger}
      {bubble}
    </>
  );
}
