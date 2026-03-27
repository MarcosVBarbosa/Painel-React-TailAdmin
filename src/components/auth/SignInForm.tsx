import { useState } from "react";
import { useNavigate } from "react-router";

import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

import { login } from "../../utils/auth";

// valida formato
function isValidUsername(username: string): boolean {
  const regex = /^[a-z]+\.([a-z]+|[a-z][a-z]+[0-9]*)$/;
  return regex.test(username);
}

export default function SignInForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [formData, setFormData] = useState({
    usuario: "",
    senha: "",
  });

  const [errors, setErrors] = useState({
    usuario: "",
    senha: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors = { usuario: "", senha: "" };

    if (!formData.usuario) {
      newErrors.usuario = "Informe o usuário";
      hasError = true;
    } else if (!isValidUsername(formData.usuario)) {
      newErrors.usuario = "Formato inválido";
      hasError = true;
    }

    if (!formData.senha) {
      newErrors.senha = "Informe a senha";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // 🔥 LOGIN FAKE
    login({
      nome: "Marcos Barbosa",
      usuario: formData.usuario,
      nivel: "Administrador",
      avatar: "",
    });

    // 🔥 REDIRECT
    navigate("/");
  };

  return (
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="mb-2 font-semibold text-gray-800 dark:text-white">
          Entrar
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Informe seu usuário e senha
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Usuário */}
          <div>
            <Label className="text-gray-800 dark:text-white">Usuário *</Label>

            <Input
              value={formData.usuario}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  usuario: e.target.value.toLowerCase(),
                })
              }
              placeholder="ex: exemplo.exemplo"
              className={errors.usuario ? "border-red-500" : ""}
            />

            {errors.usuario && (
              <p className="text-sm text-red-500">{errors.usuario}</p>
            )}
          </div>

          {/* Senha */}
          <div>
            <Label className="text-gray-800 dark:text-white">Senha *</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                className={errors.senha ? "border-red-500" : ""}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
              </span>
            </div>

            {errors.senha && (
              <p className="text-sm text-red-500">{errors.senha}</p>
            )}
          </div>

          {/* Opção */}
          <div className="flex items-center gap-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Manter conectado
            </span>
          </div>

          {/* Botão */}
          <Button type="submit" className="w-full" size="sm">
            Entrar
          </Button>
        </div>
      </form>
    </div>
  );
}
