import { DataTableBasic } from "../../interface";
import { Grid2x2, List, UserRoundPlus } from "lucide-react";
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
import TableNumberedPaginationFooter from "../ui/PaginationTable/PaginationTable"; // <-- (confira o path)
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

  const { autoPageSize } = useAutoPageSize({
    scrollContainerRef: scrollRef,
    rowHeight: 65,
    safetyGap: 2,
    min: 1,
  });

  const effectivePageSize = extPageSize ?? autoPageSize;

  const [page, setPage] = useState(1);
  const currentPage = extPage ?? page;

  const total = extTotal ?? rows.length;

  useEffect(() => {
    const lastPage = Math.max(1, Math.ceil(total / effectivePageSize));
    if (currentPage > lastPage && extPage === undefined) {
      setPage(lastPage);
    }
  }, [effectivePageSize, total, currentPage, extPage]);

  const pageRows = useMemo(() => {
    const startIdx = (currentPage - 1) * effectivePageSize;
    return rows.slice(startIdx, startIdx + effectivePageSize);
  }, [rows, currentPage, effectivePageSize]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto">
        <div className="flex min-h-full flex-col">
          <Table className="w-full">
            <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80">
              {/* Título */}
              <TableRow>
                <TableCell
                  isHeader
                  colSpan={columns.length + 1}
                  className="px-5 py-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[30px] pe-1 font-semibold text-gray-800 dark:text-white">
                        {title}
                      </h2>
                      <Button
                        size="sm"
                        startIcon={UserRoundPlus}
                        variant="success"
                        toolTip={{ text: "Novo", position: "right" }}
                      />
                    </div>
                    <div>
                      <div className="tex shadow-theme-xs inline-flex items-center">
                        <button
                          type="button"
                          className="bg-brand-500 ring-brand-500 hover:bg-brand-500 inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white ring-1 ring-inset transition first:rounded-l-lg last:rounded-r-lg"
                        >
                          <List />
                        </button>
                        <button
                          type="button"
                          className="text-brand-500 ring-brand-500 hover:bg-brand-500 -ml-px inline-flex items-center gap-2 bg-transparent px-4 py-3 text-sm font-medium ring-1 ring-inset first:rounded-l-lg last:rounded-r-lg hover:text-white"
                        >
                          <Grid2x2 />
                        </button>
                      </div>
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
                <TableCell isHeader> </TableCell>
              </TableRow>
            </TableHeader>

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
                      className={`px-5 py-3 text-gray-700 dark:text-gray-300 text-center ${
                        column.className ?? ""
                      }`}
                    >
                      {row[column.field]}
                    </TableCell>
                  ))}

                  {/* Ações */}
                  <TableCell className="px-5 py-3 w-28">
                    <div className="flex w-26 justify-between">
                      <Button
                        size="sm"
                        startIcon={PencilIcon}
                        variant="primary"
                        toolTip={{ text: "Editar" }}
                        onClick={() => {
                          console.log("Editar", row.id);
                        }}
                      />

                      <Button
                        size="sm"
                        startIcon={TrashBinIcon}
                        variant="danger"
                        toolTip={{ text: "Deletar" }}
                        onClick={() => {
                          console.log("Deletar", row.id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação (fora da tabela, em <div>) */}
          <div
            data-pagination-footer
            className="mt-auto sticky bottom-0 z-10 border-t border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/[0.05] dark:bg-[#0B1220]/80"
          >
            <div className="px-5 py-2 flex justify-end">
              <TableNumberedPaginationFooter
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
