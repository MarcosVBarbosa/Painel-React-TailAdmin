import { useState, useEffect } from "react";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import Switch from "../components/form/switch/Switch";
import { UserFormData, UserFormProps } from "../interface";



function onGeraNameUsuario(name: string): string {
  const ignorar = ["de", "da", "do", "dos", "das"];

  const arrayName = name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((n) => n.length > 0);

  if (arrayName.length < 2) {
    return "";
  }

  const firstName = arrayName[0];
  const lastName = arrayName[arrayName.length - 1];

  let abreviaName = "";

  if (arrayName.length > 2) {
    abreviaName = arrayName
      .slice(1, -1)
      .filter((n) => !ignorar.includes(n))
      .map((n) => n[0])
      .join("");
  }

  return abreviaName
    ? `${firstName}.${abreviaName}${lastName}`
    : `${firstName}.${lastName}`;
}

export default function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    departamento: "",
    usuario: "",
    nivel: "",
    status: true,
  });

  const nivelOptions = [
    { value: "Básico", label: "Básico" },
    { value: "Administrador", label: "Administrador" },
  ];

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="w-full min-w-[500px] max-w-[700px] overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
      {/* Cabeçalho */}
      <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-6 dark:border-gray-800 dark:bg-white/[0.02] lg:px-10">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">
          {user ? "Editar Usuário" : "Cadastrar Usuário"}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configure as informações do perfil abaixo.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-10">
        <div className="space-y-6">
          {/* Nome Completo */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-6">
              <Label className="mb-2 block text-sm font-medium">
                Nome Completo
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                onBlur={(e) => {
                  if (user) return;

                  const usuarioGerado = onGeraNameUsuario(e.target.value);

                  setFormData({
                    ...formData,
                    usuario: usuarioGerado,
                  });
                }}
                className="w-full rounded-xl border-gray-200 bg-gray-50/30 focus:bg-white dark:border-gray-700 dark:bg-gray-800/50"
              />
            </div>

            <div className="md:col-span-6">
              <Label className="mb-2 block text-sm font-medium">Usuário</Label>
              <Input
                type="text"
                disabled
                value={formData.usuario}
                className="w-full rounded-xl border-gray-200 bg-gray-50/30 dark:border-gray-700 dark:bg-gray-800/50"
              />
            </div>

            <div className="md:col-span-6">
              <Label className="mb-2 block text-sm font-medium">
                Nível de Acesso
              </Label>
              <Select
                options={nivelOptions}
                value={formData.nivel}
                placeholder="Selecione o nível"
                onChange={(val) => setFormData({ ...formData, nivel: val })}
                className="w-full rounded-xl dark:bg-gray-800/50"
              />
            </div>
          </div>

          {/* Status */}

          {user && (
            <div className="pt-4 flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-white/[0.02]">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-800 dark:text-white">
                  Status da Conta
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Ative ou desative o acesso do usuário
                </span>
              </div>

              <Switch
                label={formData.status ? "Ativo" : "Inativo"}
                defaultChecked={formData.status}
                onChange={(checked) =>
                  setFormData({ ...formData, status: checked })
                }
              />
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="mt-10 flex items-center justify-end gap-4 border-t border-gray-100 pt-8 dark:border-gray-800">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-6 py-3 text-sm font-bold text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-blue-600/40 active:scale-95"
          >
            {user ? "Salvar Edição" : "Criar Usuário"}
          </button>
        </div>
      </form>
    </div>
  );
}
