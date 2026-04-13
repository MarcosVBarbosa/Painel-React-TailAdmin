import { useMemo, useState, useEffect } from "react";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import Switch from "../components/form/switch/Switch";
import CardBasic from "../components/ui/card/CardBasic";
import { FormPropsCustom, UserFormData } from "../interface";
import { api } from "../services/api";
import { SetupUserName } from "../utils/SetupUserName";

type Option = {
  value: string;
  label: string;
};

interface Props extends FormPropsCustom<UserFormData> {
  rolesOptions: Option[];
}

export default function UserForm({
  data,
  onSave,
  onCancel,
  rolesOptions,
}: Props) {
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

  const [formData, setFormData] = useState<UserFormData>(defaultFormData);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(data?.id);

  // 🔽 sincroniza dados ao editar
  useEffect(() => {
    if (data) {
      setFormData({ ...defaultFormData, ...data });
      setUsernameError(null);
    }
  }, [data, defaultFormData]);

  // 🔽 submit correto (sem any)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (usernameError) return;

    if (!formData.role_id) {
      alert("Selecione um nível de acesso");
      return;
    }

    try {
      setLoading(true);

      const payload: UserFormData = { ...formData };

      if (isEdit) {
        await api.put(`/Users/${payload.id}`, payload);
      } else {
        payload.password = "12345678";
        await api.post("/Users", payload);
      }

      onSave(payload);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardBasic
      className="min-w-[500px] max-w-[700px]"
      headerContent={
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[18px] font-bold text-gray-800 dark:text-white">
            {isEdit ? "Editar Usuário" : "Cadastrar Usuário"}
          </h3>
          <p className="text-xs text-gray-400">
            Configure as informações do perfil abaixo.
          </p>
        </div>
      }
      bodyContent={
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div>
            <Label className="mb-1.5 block text-[13px] font-bold">
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
            />

            {usernameError && (
              <span className="text-xs text-red-500">{usernameError}</span>
            )}
          </div>

          {/* Username */}
          <div>
            <Label className="mb-1.5 block text-[13px] font-bold">
              Usuário
            </Label>
            <Input type="text" disabled value={formData.username} />
          </div>

          {/* Role */}
          <div>
            <Label className="mb-1.5 block text-[13px] font-bold">
              Nível de Acesso
            </Label>

            <Select
              options={rolesOptions}
              value={formData.role_id}
              placeholder="Selecione o nível"
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  role_id: val,
                }))
              }
            />
          </div>

          {/* Status */}
          {isEdit && (
            <div className="flex items-center justify-between p-3 border rounded-xl">
              <div>
                <span className="text-[13px] font-bold">Status da Conta</span>
              </div>

              <Switch
                checked={formData.status}
                label={formData.status ? "Ativo" : "Inativo"}
                onChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: checked,
                  }))
                }
              />
            </div>
          )}
        </form>
      }
      footerContent={
        <>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-gray-500"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={!!usernameError || loading}
            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
          </button>
        </>
      }
    />
  );
}
