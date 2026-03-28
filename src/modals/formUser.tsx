import { useMemo, useState, useEffect } from "react";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Select from "../components/form/Select";
import Switch from "../components/form/switch/Switch";
import CardBasic from "../components/ui/card/CardBasic";
import { FormPropsCustom, UserFormData } from "../interface";

function onGeraNameUsuario(name: string): string {
  const ignorar = ["de", "da", "do", "dos", "das"];
  const arrayName = name
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((n) => n.length > 0);
  if (arrayName.length < 2) return "";
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

export default function UserForm({
  data,
  onSave,
  onCancel,
}: FormPropsCustom<UserFormData>) {
  const defaultFormData: UserFormData = useMemo(
    () => ({
      id: 0,
      name: "",
      usuario: "",
      nivel: "",
      status: true,
    }),
    [],
  );

  const [formData, setFormData] = useState<UserFormData>(() => {
    return data ? { ...defaultFormData, ...data } : defaultFormData;
  });

  const nivelOptions = [
    { value: "Básico", label: "Básico" },
    { value: "Administrador", label: "Administrador" },
  ];

  useEffect(() => {
    if (data) setFormData({ ...defaultFormData, ...data });
  }, [data, defaultFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const headerContent = (
    <div className="flex flex-col gap-0.5">
      <h3 className="text-[18px] font-bold text-gray-800 dark:text-white">
        {data ? "Editar Usuário" : "Cadastrar Usuário"}
      </h3>
      <p className="text-xs text-gray-400">
        Configure as informações do perfil abaixo.
      </p>
    </div>
  );

  const bodyContent = (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-5">
        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Nome Completo
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData((prev) => ({
                ...prev,
                name,
                usuario: data ? prev.usuario : onGeraNameUsuario(name),
              }));
            }}
            className="w-full rounded-xl border-gray-100 bg-gray-50/30 focus:bg-white"
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Usuário
          </Label>
          <Input
            type="text"
            disabled
            value={formData.usuario}
            className="w-full rounded-xl border-gray-100 bg-gray-50/50"
          />
        </div>

        <div>
          <Label className="mb-1.5 block text-[13px] font-bold text-gray-700">
            Nível de Acesso
          </Label>
          <Select
            options={nivelOptions}
            value={formData.nivel}
            placeholder="Selecione o nível"
            onChange={(val) => setFormData((prev) => ({ ...prev, nivel: val }))}
            className="w-full rounded-xl border-gray-100 bg-gray-50/30"
          />
        </div>

        {data && (
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
        className="px-4 py-2 text-[13px] font-bold text-gray-500 transition-colors hover:text-gray-700"
      >
        Cancelar
      </button>

      <button
        type="submit"
        onClick={handleSubmit}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-[13px] font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
      >
        {data ? "Salvar Edição" : "Criar Usuário"}
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
