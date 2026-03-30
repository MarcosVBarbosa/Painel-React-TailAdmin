import { useEffect, useMemo, useState } from "react";
import {
  FormPropsCustom,
  PermissionsUserFormData,
  NavItem,
} from "../interface";
import { Eye, Plus, Edit3, Trash2 } from "lucide-react";
import CardBasic from "../components/ui/card/CardBasic";
import { navItems } from "../layout/AppSidebar";

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
    if (item.subItems && item.subItems.length > 0) {
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

export default function PermissionsUserForm({
  data,
  onSave,
  onCancel,
}: FormPropsCustom<PermissionsUserFormData>) {
  const groups = useMemo(() => getGroupsFromNav(navItems), []);

  const defaultFormData: PermissionsUserFormData = useMemo(
    () => ({
      id: 0,
      name: "",
      permissions: {},
      status: true,
    }),
    [],
  );

  const [formData, setFormData] = useState<PermissionsUserFormData>(() => {
    const initialPermissions = data?.permissions || {};
    groups.forEach((group) => {
      group.resources.forEach((res) => {
        if (!initialPermissions[res.key]) {
          initialPermissions[res.key] = {
            view: false,
            create: false,
            edit: false,
            delete: false,
          };
        }
      });
    });
    return data
      ? { ...defaultFormData, ...data, permissions: initialPermissions }
      : { ...defaultFormData, permissions: initialPermissions };
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      const updatedPermissions = data.permissions || {};
      groups.forEach((group) => {
        group.resources.forEach((res) => {
          if (!updatedPermissions[res.key]) {
            updatedPermissions[res.key] = {
              view: false,
              create: false,
              edit: false,
              delete: false,
            };
          }
        });
      });
      setFormData({
        ...defaultFormData,
        ...data,
        permissions: updatedPermissions,
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
      permissions: {
        ...prev.permissions,
        [resourceKey]: {
          ...prev.permissions?.[resourceKey],
          [action]: checked,
        },
      },
    }));
  };

  const headerContent = (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-[17px] font-bold text-gray-800 dark:text-white">
        Permissões de Acesso
      </h3>
      <p className="text-[11px] text-gray-400">
        Gerencie os privilégios organizados por módulos do sistema.
      </p>
    </div>
  );

  const bodyContent = (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.id} className="space-y-3">
          {group.hasSubItems && (
            <div className="flex items-center gap-2 px-1 pt-2">
              <div className="h-4 w-1 rounded-full bg-blue-600"></div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {group.title}
              </span>
            </div>
          )}

          <div className="space-y-3">
            {group.resources.map((resource) => (
              <div
                key={resource.key}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 px-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">
                    {resource.label}
                  </span>
                </div>

                {/* Grid Responsivo para Botões CRUD */}
                <div className="grid grid-cols-2 xs:grid-cols-4 sm:flex sm:flex-wrap gap-2">
                  {CRUD_ACTIONS.map((action) => {
                    const isActive =
                      !!formData.permissions?.[resource.key]?.[action.key];

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
                        className={`
                          flex items-center justify-center gap-2 px-3 py-2 text-[11px] font-bold transition-all duration-200 rounded-xl border w-full sm:w-auto
                          ${
                            isActive
                              ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10"
                              : "bg-white dark:bg-gray-900 text-gray-400 border-gray-100 dark:border-gray-800 hover:text-blue-600 hover:border-blue-100 dark:hover:border-blue-900/30"
                          }
                          active:scale-95
                        `}
                      >
                        {action.icon}
                        <span className="sm:inline">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const footerContent = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 w-full">
      <button
        type="button"
        onClick={onCancel}
        className="w-full sm:w-auto px-6 py-2.5 text-[12px] font-bold text-gray-400 hover:text-gray-600 transition-colors"
      >
        Cancelar
      </button>

      <button
        type="button"
        onClick={() => onSave(formData)}
        className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-2.5 text-[12px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
      >
        Salvar Alterações
      </button>
    </div>
  );

  return (
    <CardBasic
      headerContent={headerContent}
      bodyContent={bodyContent}
      footerContent={footerContent}
      className="max-w-[650px] w-full mx-auto"
    />
  );
}
