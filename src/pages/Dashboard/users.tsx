import DataTableOne from "../../components/tables/DataTableOne";
import { Column, DataTableBasic, Row } from "../../interface";

const columns: Column[] = [
  {
    id: 1,
    title: "Nome",
    field: "name",
    className: "text-center w-[500px]",
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

const dataTable: DataTableBasic = {
  columns,
  rows,
  title: "Lista de Usuários",
};

export default function Users() {
  return (
    <>
      <DataTableOne dataTable={dataTable} />
    </>
  );
}
