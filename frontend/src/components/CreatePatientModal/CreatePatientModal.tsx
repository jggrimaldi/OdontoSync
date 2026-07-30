import { useState } from "react";
import { PatientRequest } from "../../types";

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: PatientRequest) => Promise<void>;
}

export default function CreatePatientModal({
  isOpen,
  onClose,
  onCreate,
}: CreatePatientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    phone: "",
    age: "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [creating, setCreating] = useState(false);

  function validateForm() {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = "Nome é obrigatório";
    if (!formData.cpf.trim()) errors.cpf = "CPF é obrigatório";
    if (!formData.phone.trim()) errors.phone = "Telefone é obrigatório";
    if (!formData.age || isNaN(Number(formData.age)))
      errors.age = "Idade deve ser um número válido";
    return errors;
  }

  async function handleSubmit() {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCreating(true);
    try {
      await onCreate({
        name: formData.name.trim(),
        cpf: formData.cpf.trim(),
        phone: formData.phone.trim(),
        age: Number(formData.age),
      });
      setFormData({ name: "", cpf: "", phone: "", age: "" });
      onClose();
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
    } finally {
      setCreating(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Novo Paciente</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Digite o nome completo"
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CPF *
              </label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, cpf: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
              {formErrors.cpf && (
                <p className="text-red-500 text-sm mt-1">{formErrors.cpf}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idade *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, age: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Digite a idade"
                min="0"
              />
              {formErrors.age && (
                <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={creating}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={creating}
              className="flex-1 px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Criando...
                </div>
              ) : (
                "Criar Paciente"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
