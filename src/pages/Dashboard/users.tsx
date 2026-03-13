import BasicTable from "../../components/tables/BasicTable";
import { Column, DataTableBasic, Row } from "../../interface";

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
  { id: 20, name: "Isabela", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 21, name: "Gustavo", nivel: "User", contato: "", status: "Inativo" },
  { id: 22, name: "Larissa", nivel: "User", contato: "", status: "Ativo" },
  { id: 23, name: "Felipe", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 24, name: "Camila", nivel: "User", contato: "", status: "Inativo" },
  { id: 25, name: "Rafael", nivel: "User", contato: "", status: "Ativo" },
  { id: 26, name: "Juliana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 27, name: "Leonardo", nivel: "User", contato: "", status: "Inativo" },
  { id: 28, name: "Amanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 29, name: "Thiago", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 30, name: "Isabela", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 31, name: "Gustavo", nivel: "User", contato: "", status: "Inativo" },
  { id: 32, name: "Larissa", nivel: "User", contato: "", status: "Ativo" },
  { id: 33, name: "Felipe", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 34, name: "Camila", nivel: "User", contato: "", status: "Inativo" },
  { id: 35, name: "Rafael", nivel: "User", contato: "", status: "Ativo" },
  { id: 36, name: "Juliana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 37, name: "Leonardo", nivel: "User", contato: "", status: "Inativo" },
  { id: 38, name: "Amanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 39, name: "Thiago", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 40, name: "Isabela", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 41, name: "Gustavo", nivel: "User", contato: "", status: "Inativo" },
  { id: 42, name: "Larissa", nivel: "User", contato: "", status: "Ativo" },
  { id: 43, name: "Felipe", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 44, name: "Camila", nivel: "User", contato: "", status: "Inativo" },
  { id: 45, name: "Rafael", nivel: "User", contato: "", status: "Ativo" },
  { id: 46, name: "Juliana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 47, name: "Leonardo", nivel: "User", contato: "", status: "Inativo" },
  { id: 48, name: "Amanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 49, name: "Thiago", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 50, name: "Isabela", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 51, name: "Gustavo", nivel: "User", contato: "", status: "Inativo" },
  { id: 52, name: "Larissa", nivel: "User", contato: "", status: "Ativo" },
  { id: 53, name: "Felipe", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 54, name: "Camila", nivel: "User", contato: "", status: "Inativo" },
  { id: 55, name: "Rafael", nivel: "User", contato: "", status: "Ativo" },
  { id: 56, name: "Juliana", nivel: "Admin", contato: "", status: "Ativo" },
  { id: 57, name: "Leonardo", nivel: "User", contato: "", status: "Inativo" },
  { id: 58, name: "Amanda", nivel: "User", contato: "", status: "Ativo" },
  { id: 59, name: "Thiago", nivel: "Admin", contato: "", status: "Ativo" },
];

const dataTable: DataTableBasic = {
  columns,
  rows,
  title: "Lista de Usuários",
};

export default function Users() {
  return (
    <>
      <BasicTable dataTable={dataTable} />
    </>
  );
}
