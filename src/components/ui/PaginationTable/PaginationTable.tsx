import { ChevronLeft, ChevronRight } from "lucide-react";

interface TableNumberedPaginationFooterProps {
  page: number; // 1-based
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Quantos números mostrar no miolo (excluindo primeira/última). Ex.: 5 */
  siblingCount?: number;
}

/** Gera array com páginas e "..." para paginação compacta */
function getPaginationRange(
  page: number,
  total: number,
  pageSize: number,
  siblingCount: number,
): (number | "...")[] {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 5 = first + last + current + 2*ellipses (em casos grandes)
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
    // [1..totalPages]
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const range: (number | "...")[] = [];
  // Sempre inclui a primeira página
  range.push(1);

  if (showLeftDots) {
    range.push("...");
  } else {
    for (let p = 2; p < leftSibling; p++) range.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== 1 && p !== totalPages) range.push(p);
  }

  if (showRightDots) {
    range.push("...");
  } else {
    for (let p = rightSibling + 1; p < totalPages; p++) range.push(p);
  }

  // Sempre inclui a última página (se houver mais de 1)
  if (totalPages > 1) range.push(totalPages);

  return range;
}

export default function TableNumberedPaginationFooter({
  page,
  pageSize,
  total,
  onPageChange,
  className = "",
  siblingCount = 1, // ajuste para mostrar mais/menos números
}: TableNumberedPaginationFooterProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const items = getPaginationRange(page, total, pageSize, siblingCount);

  const btnBase =
    "h-9 min-w-9 px-3 inline-flex items-center justify-center rounded-md text-sm transition";
  const btnNeutral =
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 dark:bg-white/[0.02] dark:text-gray-200 dark:border-white/10 dark:hover:bg-white/[0.05]";
  const btnActive =
    "bg-blue-600 text-white border border-blue-600 hover:bg-blue-700";
  const btnDisabled = "opacity-50 cursor-not-allowed";

  return (
    <div className={`px-5 py-3 ${className}`}>
      <nav
        className="flex items-center justify-center gap-2"
        role="navigation"
        aria-label="Pagination"
      >
        {/* Previous */}
        <button
          type="button"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className={`${btnBase} ${btnNeutral} ${!canPrev ? btnDisabled : ""}`}
          aria-label="Página anterior"
        >
          <ChevronLeft />
        </button>

        {/* Números + reticências */}
        {items.map((it, idx) => {
          if (it === "...") {
            return (
              <span
                key={`dots-${idx}`}
                className="px-2 select-none text-gray-400 dark:text-gray-500"
                aria-hidden
              >
                …
              </span>
            );
          }

          const isActive = it === page;
          return (
            <button
              key={it}
              type="button"
              onClick={() => onPageChange(it as number)}
              className={`${btnBase} ${isActive ? btnActive : btnNeutral}`}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Ir para página ${it}`}
            >
              {it}
            </button>
          );
        })}

        {/* Next */}
        <button
          type="button"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className={`${btnBase} ${btnNeutral} ${!canNext ? btnDisabled : ""}`}
          aria-label="Próxima página"
        >
          <ChevronRight />
        </button>
      </nav>
    </div>
  );
}
