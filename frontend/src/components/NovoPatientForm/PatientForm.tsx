import { useEffect, useState } from "react";
import Input from "../Input/Input";
import { PatientRequest, PatientResponse, PatientUpdateRequest } from "../../types";
import { patientService } from "../../services/patientService";

interface NovoPacienteFormProps {
  onSuccess: (patient: PatientResponse) => void;
  onCancel: () => void;
  patient?: PatientResponse | null;
}

interface FormData {
  name: string;
  cpf: string;
  phone: string;
  age: string;
}

interface FormErrors {
  name?: string;
  cpf?: string;
  phone?: string;
  age?: string;
}

// Formata CPF: 000.000.000-00
function formatCpf(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Formata telefone: (00) 00000-0000
function formatPhone(value: string): string {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
}

function validate(data: FormData, mode: "create" | "edit"): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Nome é obrigatório";
  } else if (data.name.trim().length < 3) {
    errors.name = "Nome deve ter ao menos 3 caracteres";
  }

  if (mode === "create") {
    const cpfClean = data.cpf.replace(/\D/g, "");
    if (!cpfClean) {
      errors.cpf = "CPF é obrigatório";
    } else if (cpfClean.length !== 11) {
      errors.cpf = "CPF deve ter 11 dígitos";
    }
  }

  const phoneClean = data.phone.replace(/\D/g, "");
  if (!phoneClean) {
    errors.phone = "Telefone é obrigatório";
  } else if (phoneClean.length < 10) {
    errors.phone = "Telefone inválido";
  }

  if (!data.age) {
    errors.age = "Idade é obrigatória";
  } else if (Number(data.age) < 1 || Number(data.age) > 120) {
    errors.age = "Idade inválida";
  }

  return errors;
}

// USE_MOCK — troca para false quando o backend estiver rodando
const USE_MOCK = false;

export default function NovoPacienteForm({
  onSuccess,
  onCancel,
  patient = null,
}: NovoPacienteFormProps) {
  const mode: "create" | "edit" = patient ? "edit" : "create";
  const [formData, setFormData] = useState<FormData>({
    name: "",
    cpf: "",
    phone: "",
    age: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    if (!patient) {
      setFormData({ name: "", cpf: "", phone: "", age: "" });
      setErrors({});
      setApiError(null);
      return;
    }

    setFormData({
      name: patient.name ?? "",
      cpf: formatCpf(patient.cpf ?? ""),
      phone: formatPhone(patient.phone ?? ""),
      age: patient.age != null ? String(patient.age) : "",
    });
    setErrors({});
    setApiError(null);
  }, [patient]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    let formatted = value;
    if (name === "cpf") formatted = formatCpf(value);
    if (name === "phone") formatted = formatPhone(value);

    setFormData((prev) => ({ ...prev, [name]: formatted }));

    // Limpa erro do campo ao digitar
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate(formData, mode);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const common = {
      name: formData.name.trim(),
      phone: formData.phone.replace(/\D/g, ""),
      age: Number(formData.age),
    };

    try {
      setLoading(true);

      if (USE_MOCK) {
        // Simula resposta da API
        await new Promise((res) => setTimeout(res, 800));

        if (mode === "create") {
          const payload: PatientRequest = {
            ...common,
            cpf: formData.cpf.replace(/\D/g, ""),
          };
          const mockResponse: PatientResponse = {
            id: crypto.randomUUID(),
            ...payload,
            notes: null,
            imageUrl: null,
          };
          onSuccess(mockResponse);
        } else {
          const payload: PatientUpdateRequest = common;
          const mockResponse: PatientResponse = {
            ...(patient as PatientResponse),
            ...payload,
          };
          onSuccess(mockResponse);
        }
      } else {
        if (mode === "create") {
          const payload: PatientRequest = {
            ...common,
            cpf: formData.cpf.replace(/\D/g, ""),
          };
          const created = await patientService.create(payload);
          onSuccess(created);
        } else {
          const payload: PatientUpdateRequest = common;
          const updated = await patientService.update(
            (patient as PatientResponse).id,
            payload,
          );
          onSuccess(updated);
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar paciente."
            : "Erro ao editar paciente.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <Input
          label="Nome completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ex: Ana Souza"
          error={errors.name}
          required
        />
        <Input
          label="CPF"
          name="cpf"
          value={formData.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
          error={errors.cpf}
          required={mode === "create"}
          disabled={mode === "edit"}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(81) 99999-0000"
            error={errors.phone}
            required
          />
          <Input
            label="Idade"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            placeholder="Ex: 28"
            error={errors.age}
            required
          />
        </div>

        {/* Erro da API */}
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
            <svg
              width="15"
              height="15"
              fill="none"
              viewBox="0 0 24 24"
              className="shrink-0"
            >
              <path
                d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {apiError}
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 border-2 border-gray-200 text-gray-500 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            mode === "create" ? "Cadastrar Paciente" : "Salvar Alterações"
          )}
        </button>
      </div>
    </form>
  );
}
