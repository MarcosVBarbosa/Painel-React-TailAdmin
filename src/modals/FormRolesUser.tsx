import { useMemo, useState, useEffect } from "react";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Switch from "../components/form/switch/Switch";
import CardBasic from "../components/ui/card/CardBasic";
import { FormPropsCustom, FormRolesUserData, NavItem } from "../interface";
import { api } from "../services/api";
import { navItems } from "../layout/AppSidebar";
import { Eye, Plus, Edit3, Trash2 } from "lucide-react";

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
      description: "",
      status: true,
    }),
    [],
  );

  const [formData, setFormData] = useState<FormRolesUserData>(() => {
    return data ? { ...defaultFormData, ...data } : defaultFormData;
  });

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

  // 🔽 submit com POST / PUT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = { ...formData, description: "coluna será excluida" };

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
      <p className="text-xs text-gray-400">
        Configure os acessos do sistema abaixo.
      </p>
    </div>
  );

  const bodyContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-5">
        {/* Nome */}
        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Nome da Permissão
          </Label>

          <Input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white"
          />
        </div>

        {/* Status (somente edição) */}
        {isEdit && (
          <div className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/20 p-3">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-700">
                Status do Nível
              </span>
              <span className="text-[11px] text-gray-400">
                Ative ou desative este nível de acesso
              </span>
            </div>

            <Switch
              label={formData.status ? "Ativo" : "Inativo"}
              defaultChecked={formData.status}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, status: checked }))
              }
            />
          </div>
        )}

        {/* Matriz de Acessos */}
        <div className="space-y-6 pt-2">
          <Label className="block text-[14px] font-bold text-gray-800 border-b pb-2">
            Matriz de Acessos
          </Label>

          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.id} className="space-y-3">
                {group.hasSubItems && (
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                    {group.title}
                  </div>
                )}

                {group.resources.map((resource) => (
                  <div
                    key={resource.key}
                    className="flex justify-between items-center border border-gray-100 p-3 rounded-xl bg-gray-50/10"
                  >
                    <span className="text-[13px] font-semibold text-gray-700">
                      {resource.label}
                    </span>

                    <div className="flex gap-1.5">
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
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                              isActive
                                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
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
        </div>
      </div>
    </form>
  );

  const footerContent = (
    <>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-700"
      >
        Cancelar
      </button>

      <button
        type="submit"
        onClick={handleSubmit}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
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
      className="min-w-[500px] max-w-[800px]"
    />
  );
}
