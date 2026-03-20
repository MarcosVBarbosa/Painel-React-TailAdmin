import { DataTableBasic } from "../../interface";
import { UserRoundPlus, Search } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { useMemo, useRef, useState, useEffect } from "react";
import { PencilIcon, TrashBinIcon } from "../../icons";
import Button from "../ui/button/Button";
import TableNumberedPaginationFooter from "../ui/PaginationTable/PaginationTable";
import { useAutoPageSize } from "../../hooks/useAutoPageSize";

interface BasicTableProps {
  dataTable: DataTableBasic;
  page?: number; // controlado (opcional)
  pageSize?: number; // controlado (opcional)
  total?: number; // controlado (opcional)
  onChangePage?: (page: number) => void; // recomendado p/ modo controlado
  onNewClick?: () => void; // handler para "Novo"
  onEditClick?: (id: string | number) => void;
  onDeleteClick?: (id: string | number) => void;
}

const FALLBACK_PAGE_SIZE = 10;

export default function BasicTable({
  dataTable,
  page: extPage,
  pageSize: extPageSize,
  total: extTotal,
  onChangePage,
  onNewClick,
  onEditClick,
  onDeleteClick,
}: BasicTableProps) {
  // se seu id puder ser string, use string | number
  const [selectedRow, setSelectedRow] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { columns, rows, title } = dataTable;

  const { autoPageSize } = useAutoPageSize({
    scrollContainerRef: scrollRef,
    rowHeight: 63,
    safetyGap: 2,
    min: 1,
  });

  // fallback seguro
  const effectivePageSize = extPageSize ?? autoPageSize ?? FALLBACK_PAGE_SIZE;

  const [page, setPage] = useState(1);
  const isControlled = typeof extPage === "number";
  const currentPage = isControlled ? (extPage as number) : page;

  // Filtragem das linhas com base no searchTerm
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;

    const lowerSearchTerm = searchTerm.toLowerCase();
    return rows.filter((row) => {
      // Verifica se algum valor nas colunas definidas corresponde ao termo de busca
      return columns.some((col) => {
        const cellValue = row[col.field];
        if (cellValue === null || cellValue === undefined) return false;
        return String(cellValue).toLowerCase().includes(lowerSearchTerm);
      });
    });
  }, [rows, columns, searchTerm]);

  // Resetar para a primeira página quando a busca mudar
  useEffect(() => {
    if (!isControlled) {
      setPage(1);
    } else {
      onChangePage?.(1);
    }
  }, [searchTerm, isControlled, onChangePage]);

  const total = extTotal ?? filteredRows.length;

  // Corrige a página quando muda total / pageSize
  useEffect(() => {
    if (!effectivePageSize) return; // proteção adicional
    const lastPage = Math.max(1, Math.ceil(total / effectivePageSize));
    if (currentPage > lastPage && !isControlled) {
      setPage(lastPage);
    }
  }, [effectivePageSize, total, currentPage, isControlled]);

  const pageRows = useMemo(() => {
    if (!effectivePageSize) return filteredRows; // fallback defensivo
    const startIdx = (currentPage - 1) * effectivePageSize;
    return filteredRows.slice(startIdx, startIdx + effectivePageSize);
  }, [filteredRows, currentPage, effectivePageSize]);

  const handleRowClick = (id: string | number) => {
    setSelectedRow(id);
  };

  const handlePageChange = (next: number) => {
    if (isControlled) {
      onChangePage?.(next);
    } else {
      setPage(next);
    }
  };

  const showPagination = total > 0;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto">
        <div className="flex min-h-full flex-col">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80">
              {/* Título e Ações */}
              <TableRow>
                <TableCell
                  isHeader
                  colSpan={columns.length + 1}
                  className="px-5 py-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-[30px] pe-1 font-semibold text-gray-800 dark:text-white">
                      {title}
                    </h2>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      {/* Input de Busca */}
                      <div className="relative flex-1 sm:w-64">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Buscar..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-white/[0.05] dark:bg-white/[0.03] dark:text-gray-300 dark:focus:border-blue-500"
                        />
                      </div>

                      {/* Botão Novo */}
                      <Button
                        size="sm"
                        startIcon={UserRoundPlus}
                        variant="success"
                        toolTip={{ text: "Novo", position: "bottom" }}
                        onClick={onNewClick}
                        aria-label="Novo"
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* Cabeçalhos */}
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
                <TableCell isHeader aria-label="Ações">
                  {" "}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    {searchTerm
                      ? "Nenhum resultado encontrado para a busca."
                      : "Nenhum registro encontrado."}
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    aria-selected={selectedRow === row.id}
                    className={`cursor-pointer transition-colors ${
                      selectedRow === row.id
                        ? "bg-blue-300/40 dark:bg-blue-900/30"
                        : "hover:bg-gray-200 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    {columns.map((column) => {
                      const value = row[column.field];
                      const content = value ?? "—";
                      return (
                        <TableCell
                          key={column.id}
                          style={column.style}
                          className={`px-5 py-3 text-gray-700 dark:text-gray-300 text-center ${
                            column.className ?? ""
                          }`}
                          title={
                            typeof content === "string" ? content : undefined
                          }
                        >
                          {content}
                        </TableCell>
                      );
                    })}

                    {/* Ações */}
                    <TableCell className="px-5 py-3 w-24 dark:py-[11px]">
                      <div className="flex w-22 justify-between dark:w-23">
                        <Button
                          size="sm"
                          startIcon={PencilIcon}
                          variant="primary"
                          toolTip={{ text: "Editar" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick?.(row.id);
                          }}
                          aria-label={`Editar registro ${row.id}`}
                        />
                        <Button
                          size="sm"
                          startIcon={TrashBinIcon}
                          variant="danger"
                          toolTip={{ text: "Deletar" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick?.(row.id);
                          }}
                          aria-label={`Deletar registro ${row.id}`}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginação (fora da tabela) */}
          {showPagination && (
            <div
              data-pagination-footer
              className="mt-auto sticky bottom-0 z-10 border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80"
            >
              <div className="px-5 py-2 flex justify-end">
                <TableNumberedPaginationFooter
                  page={currentPage}
                  pageSize={effectivePageSize}
                  total={total}
                  onPageChange={handlePageChange}
                  className="!px-0 !py-0"
                  siblingCount={1}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
