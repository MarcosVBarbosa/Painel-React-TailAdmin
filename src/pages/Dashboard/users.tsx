import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/basicTable";
import { Column, UserFormData } from "../../interface";
import { Modal } from "../../components/ui/modal";
import UserForm from "../../modals/FormUser";
import { api } from "../../services/api";
import { Rows as RolesRows } from "./RolesUsers";

export interface Row {
  id: number;
  name: string;
  roles: string; // ✅ corrigido
  role_id: number;
  username: string;
  status: string;
}

type RoleOption = {
  value: string;
  label: string;
};

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
];

const UserFormDataClear: UserFormData = {
  id: 0,
  name: "",
  username: "",
  password: "",
  role_id: "",
  status: true,
};

export default function Users() {
  const [rows, setRows] = useState<Row[]>([]);
  const [rolesOptions, setRolesOptions] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<UserFormData | null>(null);

  // 🔽 carregar usuários
  async function getUsers() {
    try {
      const response = (await api.get("/Users/?includelist=role")).data.data;

      const mapRows = response.map((row: any) => ({
        id: row.id,
        name: row.name,
        username: row.username,
        role_id: row.role_id,
        roles: row.roles?.description || "",
        status: row.status ? "Ativo" : "Inativo",
      }));

      setRows(mapRows);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // 🔽 carregar roles
  async function getRoles() {
    try {
      const res = await api.get("/Roles/");
      const response = res.data.data || [];

      const mapped = response.map((item: RolesRows) => ({
        value: String(item.id),
        label: item.description,
      }));

      setRolesOptions(mapped);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const dataTable = {
    columns,
    rows,
    title: "Lista de Usuários",
  };

  // 🔽 novo usuário
  const handleNew = () => {
    setSelected(UserFormDataClear);
    setIsModalOpen(true);
  };

  // 🔽 editar usuário
  const handleEdit = (id: string | number) => {
    const userToEdit = rows.find((r) => r.id === Number(id));

    if (!userToEdit) return;

    // 🔥 converte Row → UserFormData
    setSelected({
      id: userToEdit.id,
      name: userToEdit.name,
      username: userToEdit.username,
      password: "",
      role_id: String(userToEdit.role_id),
      status: userToEdit.status === "Ativo",
    });

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
            setRows((prev) => {
              const role = rolesOptions.find((r) => r.value === data.role_id);

              const newRow: Row = {
                id: data.id || Date.now(),
                name: data.name,
                username: data.username,
                role_id: Number(data.role_id),
                roles: role?.label || "",
                status: data.status ? "Ativo" : "Inativo",
              };

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
