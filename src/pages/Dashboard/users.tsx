import { useState, useEffect } from "react";
import BasicTable from "../../components/tables/BasicTable";
import { Column, Row } from "../../interface";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";

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
    className: "w-20",
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
    className: "w-20",
  },
];

export default function Users() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/users?limit=100")
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mappedRows = data.users.map((u: any) => ({
          id: u.id,
          name: `${u.firstName} ${u.lastName}`,
          nivel: `${u.id % 2 == 0 ? "Básico" : "Administrador"}`,
          contato: u.email,
          status: `${u.id % 2 != 0 ? "Ativo" : "Inativo"}`,
        }));
        setRows(mappedRows);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar usuários:", err);
        setLoading(false);
      });
  }, []);

  const dataTable = {
    columns,
    rows,
    title: "Lista de Usuários",
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
          onNewClick={() => {
            setIsModalOpen(true);
            console.log(isModalOpen);
          }}
          onEditClick={(id) => console.log("Editar ID:", id)}
          onDeleteClick={(id) => console.log("Deletar ID:", id)}
        />
      )}

      <UserMetaCard
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
