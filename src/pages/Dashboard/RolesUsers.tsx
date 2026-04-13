import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/basicTable";
import { Column, FormRolesUserData, PermissionActions } from "../../interface";
import { Modal } from "../../components/ui/modal";

import { api } from "../../services/api";
import FormRolesUser from "../../modals/FormRolesUser";

export interface Row {
  id: number;
  name: string;
  description: string;
  crud: Record<string, PermissionActions>;
  status: boolean;
}

const columns: Column<Row>[] = [
  {
    id: 1,
    title: "Nome",
    field: "name",
  },
];

const FormRolesUserClear: FormRolesUserData = {
  id: 0,
  name: "",
  description: "",
  crud: {},
  status: true,
};

export default function RolesUsers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);

  // 🔽 GET
  async function getRoles() {
    try {
      const response = (await api.get("/roles")).data.data;

      const mapped: Row[] = response.map((item: any) => ({
        id: item.id,
        name: item.name,
        crud: item.crud,
        status: item.status,
      }));

      setRows(mapped);
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getRoles();
  }, []);

  const dataTable = {
    columns,
    rows,
    title: "Lista de Permissões",
  };

  // 🔽 NOVO
  const handleNew = () => {
    setSelected(FormRolesUserClear);
    setIsModalOpen(true);
  };

  // 🔽 EDIT
  const handleEdit = (id: string | number) => {
    const role = rows.find((r) => r.id === Number(id));
    if (!role) return;

    setSelected(role);
    setIsModalOpen(true);
  };

  // 🔽 DELETE
  const handleDelete = async (id: string | number) => {
    try {
      await api.delete(`/roles/${id}`);

      setRows((prev) => prev.filter((r) => r.id !== Number(id)));
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  return (
    <div className="p-4 h-[calc(100vh-100px)]">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Carregando permissões...</p>
        </div>
      ) : (
        <BasicTable
          dataTable={dataTable}
          onNewClick={handleNew}
          onEditClick={handleEdit}
          onDeleteClick={handleDelete}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <FormRolesUser
          data={selected}
          onCancel={() => setIsModalOpen(false)}
          onSave={(data) => {
            const newRow: Row = {
              id: data.id,
              name: data.name,
              crud: data.crud,
              status: data.status,
            };

            setRows((prev) => {
              const exists = prev.some((r) => r.id === newRow.id);

              if (exists) {
                return prev.map((r) => (r.id === newRow.id ? newRow : r));
              }

              return [newRow, ...prev];
            });

            setIsModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
