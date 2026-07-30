import { useState } from "react";
import Input from "../Input/Input";
import { AppointmentRequest, AppointmentResponse, PatientResponse } from "../../types";
import { appointmentService } from "../../services/appointmentService";

interface NovoAppointmentFormProps {
  patient: PatientResponse;
  onSuccess: (appointment: AppointmentResponse) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  date: string; // yyyy-mm-dd
}

interface FormErrors {
  title?: string;
  date?: string;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = "Título é obrigatório";
  } else if (data.title.trim().length < 3) {
    errors.title = "Título deve ter ao menos 3 caracteres";
  }

  if (!data.date) {
    errors.date = "Data é obrigatória";
  }

  return errors;
}

export default function NovoAppointmentForm({
  patient,
  onSuccess,
  onCancel,
}: NovoAppointmentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload: AppointmentRequest = {
      patientId: patient.id,
      title: formData.title.trim(),
      date: formData.date,
    };

    try {
      setLoading(true);
      const created = await appointmentService.create(payload);
      onSuccess(created);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao criar consulta.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div className="rounded-xl border-2 border-pink-100 bg-pink-50/40 px-4 py-3">
          <p className="text-xs font-semibold text-pink-400">Paciente</p>
          <p className="text-sm font-semibold text-gray-800">{patient.name}</p>
          <p className="text-xs text-gray-500 mt-0.5">{patient.phone}</p>
        </div>

        <Input
          label="Título"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Ex: Avaliação inicial"
          error={errors.title}
          required
        />

        <Input
          label="Data"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          error={errors.date}
          required
        />

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
              Criando...
            </>
          ) : (
            "Criar Consulta"
          )}
        </button>
      </div>
    </form>
  );
}

