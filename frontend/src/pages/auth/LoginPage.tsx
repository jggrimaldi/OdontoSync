import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Input from "../../components/Input/Input";
import { DentistRequest } from "../../types";

type TabType = "login" | "register";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  cro?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Register
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cro: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(loginData.email, loginData.password);
      navigate("/pacientes");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Erro ao fazer login. Verifique suas credenciais.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validações
    if (registerData.password !== registerData.confirmPassword) {
      setError("As senhas não correspondem");
      setLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      const payload: DentistRequest = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        cro: registerData.cro,
      };

      await register(payload);
      navigate("/pacientes");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-pink-400 to-pink-500 px-6 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-pink-400"
                >
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                    fill="currentColor"
                  />
                  <path
                    d="M12.5 7H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Odonto <span className="font-light">sync</span>
            </h1>
            <p className="text-pink-100 text-sm mt-2">
              Gestão de Consultório Odontológico
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                activeTab === "login"
                  ? "text-pink-600 border-b-2 border-pink-400 bg-pink-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5 mx-auto mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all ${
                activeTab === "register"
                  ? "text-pink-600 border-b-2 border-pink-400 bg-pink-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <svg
                className="w-5 h-5 mx-auto mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Cadastro
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="seu@email.com"
                  required
                />

                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-pink-400 to-pink-500 hover:shadow-lg hover:shadow-pink-200 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      Entrar
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Não tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("register")}
                    className="text-pink-600 font-semibold hover:text-pink-700"
                  >
                    Cadastre-se
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Nome Completo"
                  name="name"
                  type="text"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="Seu nome"
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="seu@email.com"
                  required
                />

                <Input
                  label="CRO (opcional)"
                  name="cro"
                  type="text"
                  value={registerData.cro || ""}
                  onChange={handleRegisterChange}
                  placeholder="123456/SP"
                  required={false}
                />

                <Input
                  label="Senha"
                  name="password"
                  type="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                />

                <Input
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  required
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-linear-to-r from-pink-400 to-pink-500 hover:shadow-lg hover:shadow-pink-200 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      Criar Conta
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Já tem conta?{" "}
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="text-pink-600 font-semibold hover:text-pink-700"
                  >
                    Faça login
                  </button>
                </p>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-500">
              © 2026 Gestão de Consultório Odontológico. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
