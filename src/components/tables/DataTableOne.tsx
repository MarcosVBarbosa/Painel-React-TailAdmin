import { DataTableBasic } from "../../interface";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { useState } from "react";

interface BasicTableProps {
  dataTable: DataTableBasic;
}

export default function DataTableOne({ dataTable }: BasicTableProps) {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const { columns, rows, title } = dataTable;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            {/* Título */}
            <TableRow>
              <TableCell
                isHeader
                colSpan={columns.length + 1}
                className="px-5 py-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {title}
                  </h2>
                </div>
              </TableCell>
            </TableRow>

            {/* Colunas */}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  isHeader
                  className="px-5 py-3 text-md font-semibold text-gray-700 text-center dark:text-gray-300"
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => setSelectedRow(row.id)}
                className={`cursor-pointer transition-colors ${
                  selectedRow === row.id
                    ? "bg-blue-300 dark:bg-green-900/30"
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
