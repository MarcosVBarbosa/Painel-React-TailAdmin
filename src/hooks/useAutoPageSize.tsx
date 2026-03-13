import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

type Options = {
  scrollContainerRef: RefObject<HTMLElement | null>;
  /** Se quiser apontar um seletor específico para o thead (por padrão, pega o primeiro <thead>) */
  theadSelector?: string;
  /** Se quiser apontar um seletor para o footer (por padrão, [data-pagination-footer]) */
  footerSelector?: string;
  /** Altura fixa de cada linha (px) */
  rowHeight?: number;
  /** Margem de segurança para evitar surgimento de scroll por 1px */
  safetyGap?: number;
  /** Mínimo e máximo de linhas permitidas */
  min?: number;
  max?: number;
};

export function useAutoPageSize({
  scrollContainerRef,
  theadSelector = "thead",
  footerSelector = "[data-pagination-footer]",
  rowHeight = 65,
  safetyGap = 2,
  min = 1,
  max = Number.POSITIVE_INFINITY,
}: Options) {
  const [autoPageSize, setAutoPageSize] = useState<number>(min);
  const roRef = useRef<ResizeObserver | null>(null);

  const measure = () => {
    const sc = scrollContainerRef.current;
    if (!sc) return;

    // Altura visível do container (desconta scrollbars)
    const containerH = sc.clientHeight;

    const theadEl = sc.querySelector(theadSelector) as HTMLElement | null;
    const footerEl = sc.querySelector(footerSelector) as HTMLElement | null;

    const theadH = theadEl?.getBoundingClientRect()?.height ?? 0;
    const footerH = footerEl?.getBoundingClientRect()?.height ?? 0;

    const available = Math.max(0, containerH - theadH - footerH - safetyGap);
    const possible = Math.floor(available / rowHeight);

    const next = Math.max(min, Math.min(max, possible || min));
    setAutoPageSize(next);
  };

  // Medição inicial sincrônica para reduzir "salto" visual
  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Observa resize do container e da janela
  useEffect(() => {
    const sc = scrollContainerRef.current;
    if (!sc) return;

    // ResizeObserver no container
    if ("ResizeObserver" in window) {
      roRef.current = new ResizeObserver(() => {
        // usa rAF para evitar thrash layout em sequência
        requestAnimationFrame(measure);
      });
      roRef.current.observe(sc);
    }

    // Listener de resize da janela (mudança de viewport, barra lateral, etc.)
    const onWinResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onWinResize);

    return () => {
      window.removeEventListener("resize", onWinResize);
      if (roRef.current && sc) roRef.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Exponha também uma função manual para forçar recalcular (se você mudar algo estruturalmente)
  const recompute = () => measure();

  return { autoPageSize, recompute };
}
