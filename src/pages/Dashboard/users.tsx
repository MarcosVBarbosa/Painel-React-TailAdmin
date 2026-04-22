import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/basicTable";
import { Column, FormRolesUserData, UserFormData } from "../../interface";
import { Modal } from "../../components/ui/modal";
import UserForm from "../../modals/FormUser";
import { api } from "../../services/api";

export interface Row {
  id: number;
  name: string;
  rolesName: string;
  role_id: number;
  username: string;
  status: boolean;
}

type RoleOption = {
  value: string;
  label: string;
};

type UserApiResponse = {
  id: number;
  name: string;
  username: string;
  role_id: number;
  roles?: {
    name: string;
  };
  status: boolean;
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
    field: "rolesName",
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

      const mapRows: Row[] = response.map((row: UserApiResponse) => ({
        id: row.id,
        name: row.name,
        username: row.username,
        role_id: row.role_id,
        rolesName: row.roles?.name || "",
        status: row.status,
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

      const mapped: RoleOption[] = response.map((item: FormRolesUserData) => ({
        value: String(item.id),
        label: item.name,
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

    setSelected({
      id: userToEdit.id,
      name: userToEdit.name,
      username: userToEdit.username,
      password: "",
      role_id: String(userToEdit.role_id),
      status: userToEdit.status,
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
        {selected && (
          <UserForm
            data={selected}
            rolesOptions={rolesOptions}
            onCancel={() => setIsModalOpen(false)}
            onSave={(data) => {
              setRows((prev) => {
                const role = rolesOptions.find((r) => r.value === data.role_id);

                const newRow: Row = {
                  id: data.id,
                  name: data.name,
                  username: data.username,
                  role_id: Number(data.role_id),
                  rolesName: role?.label || "",
                  status: data.status,
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
        )}
      </Modal>
    </div>
  );
}
