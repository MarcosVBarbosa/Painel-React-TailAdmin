import { useEffect, useMemo, useState } from "react";
import { FormPropsCustom, FormRolesUserData, NavItem } from "../interface";
import { Eye, Plus, Edit3, Trash2 } from "lucide-react";
import CardBasic from "../components/ui/card/CardBasic";
import { navItems } from "../layout/AppSidebar";
import { api } from "../services/api";

const CRUD_ACTIONS = [
  { key: "view", label: "Ver", icon: <Eye size={14} /> },
  { key: "create", label: "Criar", icon: <Plus size={14} /> },
  { key: "edit", label: "Editar", icon: <Edit3 size={14} /> },
  { key: "delete", label: "Excluir", icon: <Trash2 size={14} /> },
];

interface Resource {
  key: string;
  label: string;
}

interface CategoryGroup {
  id: string;
  title: string;
  hasSubItems: boolean;
  resources: Resource[];
}

const getGroupsFromNav = (items: NavItem[]): CategoryGroup[] => {
  const groups: CategoryGroup[] = [];

  items.forEach((item) => {
    if (item.subItems?.length) {
      groups.push({
        id: item.name.toLowerCase().replace(/\s+/g, "_"),
        title: item.name,
        hasSubItems: true,
        resources: item.subItems.map((sub) => ({
          key:
            sub.path.replace(/^\//, "") ||
            sub.name.toLowerCase().replace(/\s+/g, "_"),
          label: sub.name,
        })),
      });
    } else if (item.path) {
      groups.push({
        id: item.name.toLowerCase().replace(/\s+/g, "_"),
        title: item.name,
        hasSubItems: false,
        resources: [
          {
            key:
              item.path.replace(/^\//, "") ||
              item.name.toLowerCase().replace(/\s+/g, "_"),
            label: item.name,
          },
        ],
      });
    }
  });

  return groups;
};

export default function FormRolesUser({
  data,
  onSave,
  onCancel,
}: FormPropsCustom<FormRolesUserData>) {
  const groups = useMemo(() => getGroupsFromNav(navItems), []);

  const defaultFormData: FormRolesUserData = useMemo(
    () => ({
      id: 0,
      name: "",
      crud: {},
      status: true,
    }),
    [],
  );

  const [formData, setFormData] = useState<FormRolesUserData>(defaultFormData);
  const [loading, setLoading] = useState(false);

  const isEdit = data?.id !== 0;

  // 🔽 montar permissões padrão
  const buildRoles = (base?: any) => {
    const Roles = { ...(base || {}) };

    groups.forEach((group) => {
      group.resources.forEach((res) => {
        if (!Roles[res.key]) {
          Roles[res.key] = {
            view: false,
            create: false,
            edit: false,
            delete: false,
          };
        }
      });
    });

    return Roles;
  };

  // 🔽 carregar data
  useEffect(() => {
    if (data) {
      setFormData({
        ...defaultFormData,
        ...data,
        crud: buildRoles(data.crud),
      });
    } else {
      setFormData({
        ...defaultFormData,
        crud: buildRoles(),
      });
    }
  }, [data, defaultFormData, groups]);

  const handleTogglePermission = (
    resourceKey: string,
    action: string,
    checked: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      crud: {
        ...prev.crud,
        [resourceKey]: {
          ...prev.crud?.[resourceKey],
          [action]: checked,
        },
      },
    }));
  };

  // 🔥 PADRÃO IGUAL AO USERFORM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { ...formData };

      if (isEdit) {
        await api.put(`/roles/${payload.id}`, payload);
      } else {
        await api.post("/roles", payload);
      }

      onSave(payload);
    } catch (error) {
      console.error("Erro ao salvar permissões:", error);
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-[18px] font-bold text-gray-800 dark:text-white">
        {isEdit ? "Editar Permissão" : "Cadastrar Permissão"}
      </h3>
      <p className="text-xs text-gray-400">Configure os acessos do sistema.</p>
    </div>
  );

  const bodyContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <span className="text-[13px] font-bold text-gray-700">
          Nome da Permissão
        </span>
        <input
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50"
        />
      </div>

      {/* Permissões */}
      <div className="space-y-6">
        {groups.map((group) => (
          <div key={group.id} className="space-y-3">
            {group.hasSubItems && (
              <div className="text-xs font-bold text-gray-400 uppercase">
                {group.title}
              </div>
            )}

            {group.resources.map((resource) => (
              <div
                key={resource.key}
                className="flex justify-between items-center border p-3 rounded-xl"
              >
                <span className="text-sm font-bold">{resource.label}</span>

                <div className="flex gap-2">
                  {CRUD_ACTIONS.map((action) => {
                    const isActive =
                      !!formData.crud?.[resource.key]?.[action.key];

                    return (
                      <button
                        key={action.key}
                        type="button"
                        onClick={() =>
                          handleTogglePermission(
                            resource.key,
                            action.key,
                            !isActive,
                          )
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </form>
  );

  const footerContent = (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-[13px] font-bold text-gray-500"
      >
        Cancelar
      </button>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar Edição" : "Criar Permissão"}
      </button>
    </>
  );

  return (
    <CardBasic
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={footerContent}
      className="min-w-[500px] max-w-[700px]"
    />
  );
}
