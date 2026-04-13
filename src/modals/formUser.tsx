import { useMemo, useState, useEffect } from "react";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import Switch from "../components/form/switch/Switch";
import CardBasic from "../components/ui/card/CardBasic";
import { FormPropsCustom, UserFormData } from "../interface";
import { api } from "../services/api";
import { Rows as RolesRows } from "../pages/Dashboard/RolesUsers";
import { SetupUserName } from "../utils/SetupUserName";

type Option = {
  value: string;
  label: string;
};

export default function UserForm({
  data,
  onSave,
  onCancel,
}: FormPropsCustom<UserFormData>) {
  const defaultFormData: UserFormData = useMemo(
    () => ({
      id: 0,
      name: "",
      username: "",
      password: "",
      role_id: "",
      status: true,
    }),
    [],
  );

  const [formData, setFormData] = useState<UserFormData>(() => {
    return data ? { ...defaultFormData, ...data } : defaultFormData;
  });

  const [rolesOptions, setRolesOptions] = useState<Option[]>([]);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = data?.id !== 0;

  // 🔽 carregar roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get("/Roles/");
        const response = res.data.data || [];

        const mapped = response.map((item: RolesRows) => ({
          value: String(item.id),
          label: item.description,
        }));

        setRolesOptions(mapped);
      } catch (error) {
        console.error("Erro ao carregar roles:", error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({ ...defaultFormData, ...data });
      setUsernameError(null);
    }
  }, [data, defaultFormData]);

  // 🔽 submit com POST / PUT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (usernameError) return;

    try {
      setLoading(true);

      let payload: UserFormData = { ...formData };

      if (isEdit) {
        await api.put(`/Users/${payload.id}`, payload);
      } else {
        payload = {
          ...payload,
          password: "12345678",
        };

        await api.post("/Users", payload);
      }

      onSave(payload);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  const headerContent = (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-[18px] font-bold text-gray-800 dark:text-white">
        {isEdit ? "Editar Usuário" : "Cadastrar Usuário"}
      </h3>
      <p className="text-xs text-gray-400">
        Configure as informações do perfil abaixo.
      </p>
    </div>
  );

  const bodyContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-5">
        {/* Nome */}
        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Nome Completo
          </Label>

          <Input
            type="text"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              const result = SetupUserName(name);

              if (typeof result === "object") {
                setUsernameError(result.erro);

                setFormData((prev) => ({
                  ...prev,
                  name,
                }));
              } else {
                setUsernameError(null);

                setFormData((prev) => ({
                  ...prev,
                  name,
                  username: !isEdit ? result : prev.username,
                }));
              }
            }}
            className="w-full rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white"
          />

          {usernameError && (
            <span className="text-xs text-red-500 mt-1 block">
              {usernameError}
            </span>
          )}
        </div>

        {/* Username */}
        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Usuário
          </Label>
          <Input
            type="text"
            disabled
            value={formData.username}
            className="w-full rounded-xl border-gray-100 bg-gray-50/50"
          />
        </div>

        {/* Roles */}
        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Nível de Acesso
          </Label>
          <Select
            options={rolesOptions}
            value={formData.role_id}
            placeholder="Selecione o nível"
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, role_id: val }))
            }
            className="w-full rounded-xl border-gray-100 bg-gray-50/30"
          />
        </div>

        {/* Status (somente edição) */}
        {isEdit && (
          <div className="flex items-center justify-between rounded-xl border border-gray-50 bg-gray-50/20 p-3">
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-gray-700">
                Status da Conta
              </span>
              <span className="text-[11px] text-gray-400">
                Ative ou desative o acesso
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
        disabled={!!usernameError || loading}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 disabled:opacity-50"
      >
        {loading ? "Salvando..." : isEdit ? "Salvar Edição" : "Criar Usuário"}
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
