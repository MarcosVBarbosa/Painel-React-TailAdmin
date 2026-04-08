import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/basicTable";
import { Column } from "../../interface";
import { Modal } from "../../components/ui/modal";
import UserForm from "../../modals/formUser";
import { api } from "../../services/api";
import { Rows as RolesRows } from "./PermissionsUsers";

export interface Row {
  id: number;
  name: string;
  roles: RolesRows;
  role_id: number;
  username: string;
  status: string;
}

const columns: Column<Row>[] = [
  {
    id: 1,
    title: "Nome",
    field: "name",
  },
  {
    id: 2,
    title: "Nivel",
    field: "roles",
    className: "w-20",
  },
  {
    id: 3,
    title: "Usuário",
    field: "username",
  },
  {
    id: 4,
    title: "Status",
    field: "status",
    className: "w-20",
  },
];

export default function Users() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setselected] = useState<any>(null);

  async function getUsers() {
    return (await api.get("/Users/?includelist=role")).data.data;
  }

  useEffect(() => {
    getUsers().then((rows) => {
      const mapRows = rows.map((row: Row) => ({
        id: row.id,
        name: row.name,
        username: row.username,
        role_id: row.role_id,
        roles: row.roles.description,
        status: row.status ? "Ativos" : "Inativos",
      }));
      setRows(mapRows);
      setLoading(false);
    });
  }, []);

  const dataTable = {
    columns,
    rows,
    title: "Lista de Usuários",
  };

  // Função para abrir o modal para NOVO usuário
  const handleNew = () => {
    setselected(null); // Limpa o usuário selecionado
    setIsModalOpen(true);
  };

  // Função para abrir o modal para EDITAR usuário
  const handleEdit = (id: string | number) => {
    const userToEdit = rows.find((r) => r.id === id);
    console.log(userToEdit);
    setselected(userToEdit); // Define o usuário que será editado
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 h-[calc(100vh-100px)]">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Carregando usuários...</p>
        </div>
      ) : (
        <BasicTable
          dataTable={dataTable}
          onNewClick={handleNew}
          onEditClick={handleEdit}
          onDeleteClick={(id) => console.log("Deletar ID:", id)}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <UserForm
          data={selected}
          onCancel={() => setIsModalOpen(false)}
          onSave={(data) => {
            console.log("Dados a enviar para API:", data);
            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
