import { ChangeEvent, useEffect, useState } from "react";
import { PatientResponse, AppointmentResponse } from "../../types";
import Avatar from "../Avatar/Avatar";
import { formatDate, formatStatus } from "../../utils/helpers";
import { patientService } from "../../services/patientService";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface PacientePainelProps {
  patient: PatientResponse;
  appointments: AppointmentResponse[];
  loadingAppointments: boolean;
  onClose: () => void;
  onNewAppointment: () => void;
  onEdit: () => void;
  onSelectAppointment: (appointment: AppointmentResponse) => void;
  onPatientUpdated?: (patient: PatientResponse) => void;
  overlay?: boolean;
  initialNotesOpen?: boolean;
  onNotesClose?: () => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  FINISHED: "bg-green-50 text-green-600",
  CANCELED: "bg-red-50 text-red-400",
};

export default function PacientePainel({
  patient,
  appointments,
  loadingAppointments,
  onClose,
  onNewAppointment,
  onEdit,
  onSelectAppointment,
  onPatientUpdated,
  overlay = false,
  initialNotesOpen = false,
  onNotesClose,
}: PacientePainelProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(patient.notes ?? "");
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ name: string; dataUrl: string }>
  >([]);

  useEffect(() => {
    setShowNotes(Boolean(initialNotesOpen));
  }, [initialNotesOpen]);

  useEffect(() => {
    if (showNotes) {
      setNoteText(patient.notes ?? "");
      setUploadedImages(
        patient.imageUrl ? [{ name: "image", dataUrl: patient.imageUrl }] : [],
      );
    }
  }, [showNotes, patient.notes, patient.imageUrl]);

  async function fileToDataUrl(file: File): Promise<string> {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
      reader.readAsDataURL(file);
    });
  }

  const onImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const previews = await Promise.all(
      fileArray.map(async (file) => ({
        name: file.name,
        dataUrl: await fileToDataUrl(file),
      })),
    );
    setUploadedImages((prev) => [...prev, ...previews]);
  };

  function handleDeleteImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSaveNotes = async () => {
    const firstImage = uploadedImages[0]?.dataUrl ?? null;

    try {
      const updated = await patientService.updateNotes(patient.id, {
        notes: noteText,
        imageUrl: firstImage,
      });
      setNoteText(updated.notes ?? "");
      setUploadedImages(
        updated.imageUrl
          ? [{ name: "image", dataUrl: updated.imageUrl }]
          : [],
      );
      onPatientUpdated?.(updated);
      setShowNotes(false);
      onNotesClose?.();
    } catch (error: any) {
      console.error("Erro ao salvar notas", error);
      if (error.message === "Network Error") {
        alert(
          "Network Error: verifique se o backend está rodando em " +
            API_BASE_URL,
        );
      } else {
        alert("Erro ao salvar notas. Veja console para detalhes.");
      }
    }
  };

  return (
    <div
      id="patient-panel"
      className={`w-full shrink-0 slide-in ${
        overlay ? "max-w-3xl mx-auto" : "lg:w-80 xl:w-96"
      }`}
    >
      <div
        className={`bg-white rounded-2xl border-2 overflow-hidden shadow-sm ${
          overlay ? "border-pink-300" : "border-pink-200 sticky top-24"
        }`}
      >
        {/* Banner */}
        <div className="h-20 bg-linear-to-br from-pink-400 via-rose-300 to-fuchsia-300 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/25 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors"
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center px-5">
          <button
            type="button"
            onClick={() => setShowNotes(true)}
            className="mt-1 rounded-full border-2 border-pink-200 hover:border-pink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300"
          >
            <Avatar name={patient.name} size="lg" border />
          </button>
        </div>

        <div className="px-5 pt-3 pb-6">
          <h2 className="text-center font-bold text-gray-800 text-lg font-display">
            {patient.name}
          </h2>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              {
                label: "Idade",
                valor: patient.age ? `${patient.age} anos` : "—",
              },
              { label: "CPF", valor: patient.cpf },
              { label: "Telefone", valor: patient.phone },
              { label: "Notas", valor: patient.notes ?? "—" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                <p className="text-sm font-semibold text-gray-700 truncate">
                  {item.valor}
                </p>
              </div>
            ))}
          </div>

          {/* Consultas */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Consultas</h3>
            </div>

            {loadingAppointments ? (
              <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-pink-300 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : appointments.length === 0 ? (
              <p className="text-xs text-gray-300 text-center py-4">
                Nenhuma consulta registrada
              </p>
            ) : (
              <div className="space-y-2">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onSelectAppointment(appointment)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 cursor-pointer transition-colors group"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                          stroke="#f472b6"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {appointment.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDate(appointment.date)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[appointment.status]}`}
                    >
                      {formatStatus(appointment.status)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 mt-5">
            <button
              onClick={onEdit}
              className="flex-1 py-2.5 border-2 border-pink-200 text-pink-400 rounded-xl text-sm font-semibold hover:bg-pink-50 transition-colors"
            >
              Editar
            </button>
            <button
              onClick={onNewAppointment}
              className="flex-1 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
            >
              + Consulta
            </button>
          </div>
        </div>
      </div>

      {showNotes && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border-2 border-pink-200 p-5 relative">
            <button
              type="button"
              onClick={() => {
                setShowNotes(false);
                onNotesClose?.();
              }}
              className="absolute top-3 right-3 text-pink-400 bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center font-bold"
              aria-label="Fechar notas"
            >
              ×
            </button>
            <h3 className="mb-3 text-lg font-semibold text-gray-700">
              Notas de {patient.name}
            </h3>

            <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
              <textarea
                rows={10}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full resize-none p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100"
                placeholder="Escreva notas do paciente..."
              />

              {uploadedImages.length > 0 && (
                <div className="border-t border-gray-100 px-3 py-3 bg-white">
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div
                        key={`${img.name}-${index}`}
                        className="relative h-24 rounded-xl bg-gray-100 overflow-hidden"
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-1 right-1 w-7 h-7 rounded-full bg-black/55 hover:bg-black/70 text-white flex items-center justify-center"
                          aria-label="Apagar foto"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-100 px-3 py-2 bg-gray-50 flex items-center justify-between gap-3">
                <label className="inline-flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImageChange}
                    className="hidden"
                  />
                  <span className="rounded-lg bg-pink-50 px-2.5 py-1 border border-pink-200 text-pink-600 font-semibold">
                    Foto
                  </span>
                </label>
                <p className="text-xs text-gray-400">
                  {uploadedImages.length} foto(s)
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowNotes(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-pink-400 text-white rounded-lg text-sm hover:bg-pink-500"
              >
                Salvar notas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}