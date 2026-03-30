import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/BasicTable";
import { Column, PermissionActions } from "../../interface";
import { Modal } from "../../components/ui/modal";
import PermissionsUserForm from "../../modals/FormPermissionsUser";

export interface Row {
  id: number;
  name: string;
  permissions: Record<string, PermissionActions>;
  status: number;
}

const columns: Column<Row>[] = [
  {
    id: 1,
    title: "Nome",
    field: "name",
  },
  {
    id: 4,
    title: "Status",
    field: "status",
    className: "w-20",
  },
];

export default function PermissionsUsers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const mappedRows: Row[] = [
      {
        id: 1,
        name: "Admin",
        permissions: {
          dashboard: { view: true, create: true, edit: true, delete: true },
          users: { view: true, create: true, edit: true, delete: true },
          permissionsusers: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
          Notifications: {
            view: true,
            create: true,
            edit: true,
            delete: true,
          },
        },
        status: 1,
      },
      {
        id: 2,
        name: "Basic",
        permissions: {
          dashboard: { view: true, create: true, edit: true, delete: true },
          users: { view: false, create: false, edit: false, delete: false },
          permissionsusers: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          Notifications: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
        },
        status: 1,
      },
    ];
    setRows(mappedRows);
    setLoading(false);
  }, []);

  const dataTable = {
    columns,
    rows,
    title: "Lista de Permissões",
  };

  // Função para abrir o modal para NOVO usuário
  const handleNew = () => {
    setSelected(null); // Limpa o usuário selecionado
    setIsModalOpen(true);
  };

  // Função para abrir o modal para EDITAR usuário
  const handleEdit = (id: string | number) => {
    const userToEdit = rows.find((r) => r.id === id);
    setSelected(userToEdit); // Define o usuário que será editado
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
        <PermissionsUserForm
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
