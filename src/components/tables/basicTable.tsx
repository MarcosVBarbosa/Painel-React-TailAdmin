// src/components/BasicTable/index.tsx
import { DataTableBasic } from "../../interface";
import { UserRoundPlus } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table"; // não usamos <TableFooter> dentro da <table>
import { useMemo, useRef, useState, useEffect } from "react";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Button from "../ui/button/Button";
import TableNumberedPaginationFooter from "../ui/PaginationTable/PaginationTable";
import { useAutoPageSize } from "../../hooks/useAutoPageSize";

interface BasicTableProps {
  dataTable: DataTableBasic;
  page?: number;
  pageSize?: number;
  total?: number;
}

export default function BasicTable({
  dataTable,
  page: extPage,
  pageSize: extPageSize,
  total: extTotal,
}: BasicTableProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { columns, rows, title } = dataTable;

  // === PAGE SIZE automático (usa 65px por linha como você pediu) ===
  const { autoPageSize } = useAutoPageSize({
    scrollContainerRef: scrollRef,
    rowHeight: 65,
    safetyGap: 2, // evita scroll por 1px de borda/sombra
    min: 1,
  });

  // Se quiser priorizar o pageSize externo, use: const effectivePageSize = extPageSize ?? autoPageSize;
  const effectivePageSize = extPageSize ?? autoPageSize;

  // paginação local (se não vier 'page' de fora)
  const [page, setPage] = useState(1);
  const currentPage = extPage ?? page;

  const total = extTotal ?? rows.length;

  // Se o pageSize mudar e a página atual ficar "fora", ajusta
  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(total / effectivePageSize));
    if (currentPage > lastPage && extPage === undefined) {
      setPage(lastPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectivePageSize, total]);

  // Sempre que mudar layout (ex.: abrir/fechar sidebar), você pode chamar recompute()
  // Ex.: useEffect(() => { recompute(); }, [isExpanded, isHovered, isMobileOpen]);

  const pageRows = useMemo(() => {
    if (extPage !== undefined) {
      // modo controlado: o pai já manda as linhas paginadas/filtradas (ou controla página fora)
      const startIdx = (currentPage - 1) * effectivePageSize;
      return rows.slice(startIdx, startIdx + effectivePageSize);
    }
    // modo não-controlado: corta localmente
    const startIdx = (currentPage - 1) * effectivePageSize;
    return rows.slice(startIdx, startIdx + effectivePageSize);
  }, [rows, currentPage, effectivePageSize, extPage]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* SCROLL CONTAINER (tem o ref que o hook usa para medir) */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto">
        <div className="flex min-h-full flex-col">
          {/* Tabela */}
          <Table className="w-full table-fixed">
            {/* Header sticky */}
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80">
              {/* Título */}
              <TableRow>
                <TableCell
                  isHeader
                  colSpan={columns.length + 1}
                  className="px-5 py-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {title}
                    </h2>
                    <Button
                      size="sm"
                      startIcon={UserRoundPlus}
                      variant="primary"
                      toolTip={{ text: "Novo Usuário", position: "left" }}
                    />
                  </div>
                </TableCell>
              </TableRow>

              {/* Cabeçalhos das colunas */}
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    isHeader
                    className="px-5 py-3 text-center text-md font-semibold text-gray-700 dark:text-gray-300"
                  >
                    {column.title}
                  </TableCell>
                ))}
                <TableCell
                  isHeader
                  className="w-[180px] px-5 py-3 text-center text-md font-semibold text-gray-700 dark:text-gray-300"
                >
                  Opções
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pageRows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelectedRow(row.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedRow === row.id
                      ? "bg-blue-300/40 dark:bg-blue-900/30"
                      : "hover:bg-gray-200 dark:hover:bg-white/[0.05]"
                  }`}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={column.style}
                      className={`px-5 py-3 text-gray-700 dark:text-gray-300 ${
                        column.className ?? "text-center"
                      }`}
                    >
                      {row[column.field]}
                    </TableCell>
                  ))}

                  <TableCell className="px-5 py-3">
                    <div className="flex w-full justify-between">
                      <Button
                        size="sm"
                        startIcon={PencilIcon}
                        variant="primary"
                        toolTip={{ text: "Editar Usuário" }}
                      />
                      <Button
                        size="sm"
                        startIcon={TrashBinIcon}
                        variant="danger"
                        toolTip={{ text: "Deletar Usuário" }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Faux footer:
              - data-pagination-footer: o hook encontra e mede a altura
              - mt-auto: empurra para o fundo quando não há scroll
              - sticky bottom-0: fixa no fundo quando há scroll */}
          <div
            data-pagination-footer
            className="mt-auto sticky bottom-0 z-10 border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80"
          >
            <div className="px-5 py-2">
              <TableNumberedPaginationFooter
                colSpan={1} // irrelevante nesta abordagem (mantido por compat)
                page={currentPage}
                pageSize={effectivePageSize}
                total={total}
                onPageChange={extPage ? () => {} : setPage}
                className="!px-0 !py-0"
                siblingCount={1}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
