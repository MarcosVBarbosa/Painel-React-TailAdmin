import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { login, isAuthenticated } from "../../utils/auth";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

interface FormErrors {
  username: string;
  password: string;
  general: string;
}

export default function SignInForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
    general: "",
  });

  // ✅ Redireciona apenas se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const newErrors: FormErrors = {
      username: "",
      password: "",
      general: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Informe o usuário";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = "Informe a senha";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsLoading(true);
    setErrors((prev) => ({ ...prev, general: "" }));

    try {
      const user = await login({
        username: formData.username.toLowerCase(),
        password: formData.password,
      });

      if (!user.status) {
        setErrors((prev) => ({
          ...prev,
          general: "Usuário inativo. Contate o administrador.",
        }));
        return;
      }

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;

        setErrors((prev) => ({
          ...prev,
          general: message,
        }));
      } else if (error instanceof Error) {
        setErrors((prev) => ({
          ...prev,
          general: error.message,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "Erro ao fazer login",
        }));
      }
    } finally {
      setIsLoading(false);
    }
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
          {errors.general && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.general}
              </p>
            </div>
          )}

          {/* USERNAME */}
          <div>
            <Label className="text-gray-800 dark:text-white">Usuário *</Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Digite seu username"
              error={!!errors.username}
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <Label className="text-gray-800 dark:text-white">Senha *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                error={!!errors.password}
                disabled={isLoading}
                placeholder="Digite sua senha"
                autoComplete="current-password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer opacity-50"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </span>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* SUBMIT */}
          <Button
            type="submit"
            className="w-full"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
