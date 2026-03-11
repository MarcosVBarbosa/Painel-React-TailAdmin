import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../ui/table";
import { useState } from "react";

interface Column {
  id: number;
  title: string;
  field: keyof Row;
}

interface Row {
  id: number;
  name: string;
  nivel: string;
  contato: string;
  status: string;
}

const columns: Column[] = [
  {
    id: 1,
    title: "Nome",
    field: "name",
  },
  {
    id: 2,
    title: "Nivel",
    field: "nivel",
  },
  {
    id: 3,
    title: "Contato",
    field: "contato",
  },
  {
    id: 4,
    title: "Status",
    field: "status",
  },
];

const rows: Row[] = [
  { id: 1, name: "Marcos", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 2, name: "João", nivel: "User", contato: "", status: "Inativo" },
  { id: 3, name: "Maria", nivel: "User", contato: "", status: "Ativo" },
  { id: 4, name: "Ana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 5, name: "Carlos", nivel: "User", contato: "", status: "Inativo" },
  { id: 6, name: "Fernanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 7, name: "Ricardo", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 8, name: "Sofia", nivel: "User", contato: "", status: "Inativo" },
  { id: 9, name: "Bruno", nivel: "User", contato: "", status: "Ativo" },
  { id: 10, name: "Isabela", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 11, name: "Gustavo", nivel: "User", contato: "", status: "Inativo" },
  { id: 12, name: "Larissa", nivel: "User", contato: "", status: "Ativo" },
  { id: 13, name: "Felipe", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 14, name: "Camila", nivel: "User", contato: "", status: "Inativo" },
  { id: 15, name: "Rafael", nivel: "User", contato: "", status: "Ativo" },
  { id: 16, name: "Juliana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 17, name: "Leonardo", nivel: "User", contato: "", status: "Inativo" },
  { id: 18, name: "Amanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 19, name: "Thiago", nivel: "Admin", contato: "", status: "Ativo" },
];

export default function BasicTableOne() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* HEADER */}
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            {/* Linha 1 - Título + Search */}
            <TableRow>
              <TableCell
                isHeader
                colSpan={columns.length + 1}
                className="px-5 py-4"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Usuários
                  </h2>

                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Pesquisar..."
                      className="w-full pl-3 pr-10 py-2 text-sm border rounded-lg outline-none
                      focus:ring-2 focus:ring-green-500 focus:border-green-500
                      dark:bg-transparent"
                    />

                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </TableCell>
            </TableRow>

            {/* Linha 2 - Colunas */}
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  isHeader
                  className="px-5 py-3 text-sm font-semibold text-gray-700 text-center dark:text-gray-300"
                >
                  {column.title}
                </TableCell>
              ))}

              <TableCell
                isHeader
                className="px-5 py-3 text-sm font-semibold text-gray-700 text-center dark:text-gray-300"
              >
                Ações
              </TableCell>
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
                    ? "bg-green-50 dark:bg-green-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-white/[0.05]"
                }`}
              >
                {columns.map((column) => (
                  <TableCell key={column.id} className="px-5 py-3 text-center">
                    {row[column.field]}
                  </TableCell>
                ))}

                <TableCell className="px-5 py-3 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Editar", row.id);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Excluir", row.id);
                    }}
                    className="ml-3 text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
