import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { DentistResponse, DentistUpdateRequest } from "../../types";

interface DentistProfilePanelProps {
  dentist: DentistResponse;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dentist: DentistUpdateRequest) => Promise<void>;
}

interface DentistFormState {
  name: string;
  email: string;
  cro: string;
}

export default function DentistProfilePanel({
  dentist,
  isOpen,
  onClose,
  onSave,
}: DentistProfilePanelProps) {
  const [formData, setFormData] = useState<DentistFormState>({
    name: dentist.name,
    email: dentist.email,
    cro: dentist.cro ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: dentist.name,
      email: dentist.email,
      cro: dentist.cro ?? "",
    });
    setError("");
  }, [dentist, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Preencha nome e email para continuar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onSave({
        name: formData.name.trim(),
        email: formData.email.trim(),
        cro: formData.cro.trim() || null,
      });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Não foi possível atualizar o perfil do dentista.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <aside className="absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl border-l border-pink-100 flex flex-col slide-in">
        <div className="px-6 py-5 border-b border-pink-100 bg-linear-to-r from-pink-50 via-white to-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                Dentist Profile
              </p>
              <h2 className="mt-2 text-2xl font-bold text-gray-800 font-display">
                Editar dentista
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Atualize os campos que desejar e clique em "Salvar alterações" para atualizar o seu perfil.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white border border-pink-100 hover:bg-pink-50 flex items-center justify-center transition-colors"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="#6b7280" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="mt-5 inline-flex items-center rounded-2xl border border-pink-100 bg-white p-1 shadow-sm">
            <button
              type="button"
              className="px-4 py-2 rounded-xl bg-pink-500 text-white text-sm font-semibold shadow-sm"
            >
              Dados do dentista
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50/70">
          <div className="space-y-6">
            <section className="bg-white border border-pink-100 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M5 20a7 7 0 0 1 14 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-800">Informações principais</h3>
                  <p className="text-sm text-gray-400">Campos de identificação e contato profissional.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Input
                  label="Nome"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nome completo do dentista"
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="dentista@clinica.com"
                  required
                />

                <Input
                  label="CRO"
                  name="cro"
                  value={formData.cro}
                  onChange={handleChange}
                  placeholder="123456/UF"
                />
              </div>
            </section>

            {error && (
              <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 mt-6 pt-4 bg-linear-to-t from-gray-50 via-gray-50 to-transparent">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-2xl border border-gray-200 bg-white text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className={loading
                  ? "px-5 py-3 rounded-2xl font-semibold text-white transition-all bg-gray-300 cursor-not-allowed"
                  : "px-5 py-3 rounded-2xl font-semibold text-white transition-all bg-linear-to-r from-pink-400 to-pink-500 hover:shadow-lg hover:shadow-pink-200"}
              >
                {loading ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </form>
      </aside>
    </div>
  );
}
