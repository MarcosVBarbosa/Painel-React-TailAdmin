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

// 🔥 GERA GRUPOS BASEADOS NO SIDEBAR
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
            sub.permission ||
            sub.path?.replace(/^\//, "") ||
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
              item.permission ||
              item.path?.replace(/^\//, "") ||
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

  const [formData, setFormData] = useState<FormRolesUserData>(defaultFormData);

  const [loading, setLoading] = useState(false);

  const isEdit = data?.id !== 0;

  // 🔥 MONTA E NORMALIZA PERMISSÕES
  const buildRoles = (base?: any) => {
    const roles = { ...(base || {}) };

    groups.forEach((group) => {
      group.resources.forEach((res) => {
        roles[res.key] = {
          view: roles[res.key]?.view ?? false,
          create: roles[res.key]?.create ?? false,
          edit: roles[res.key]?.edit ?? false,
          delete: roles[res.key]?.delete ?? false,
        };
      });
    });

    return roles;
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

  // 🔥 SUBMIT CORRIGIDO
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
        crud: formData.crud,
      };

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

  return (
    <CardBasic
      className="min-w-[500px] max-w-[800px]"
      headerContent={
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[18px] font-bold text-gray-800 dark:text-white">
            {isEdit ? "Editar Permissão" : "Cadastrar Permissão"}
          </h3>
          <p className="text-xs text-gray-400">
            Configure os acessos do sistema abaixo.
          </p>
        </div>
      }
      bodyContent={
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <Label className="mb-1.5 block text-[13px] font-bold">
              Nome da Permissão
            </Label>

            <Input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </div>

          {/* Status */}
          {isEdit && (
            <div className="flex items-center justify-between p-3 border rounded-xl">
              <span className="text-[13px] font-bold">Status do Nível</span>

              <Switch
                label={formData.status ? "Ativo" : "Inativo"}
                defaultChecked={formData.status}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: checked,
                  }))
                }
              />
            </div>
          )}

          {/* MATRIZ */}
          <div className="space-y-6">
            {groups.map((group) => (
              <div key={group.id}>
                {group.hasSubItems && (
                  <div className="text-xs font-bold text-gray-400 mb-2">
                    {group.title}
                  </div>
                )}

                {group.resources.map((resource) => (
                  <div
                    key={resource.key}
                    className="flex justify-between items-center border p-3 rounded-xl mb-2"
                  >
                    <span>{resource.label}</span>

                    <div className="flex gap-1">
                      {CRUD_ACTIONS.map((action) => {
                        const active =
                          formData.crud?.[resource.key]?.[action.key];

                        return (
                          <button
                            key={action.key}
                            type="button"
                            onClick={() =>
                              handleTogglePermission(
                                resource.key,
                                action.key,
                                !active,
                              )
                            }
                            className={`px-3 py-1 rounded ${
                              active ? "bg-blue-600 text-white" : "bg-gray-200"
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
      }
      footerContent={
        <>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </>
      }
    />
  );
}
