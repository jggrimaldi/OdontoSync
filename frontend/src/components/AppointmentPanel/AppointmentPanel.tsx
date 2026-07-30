import { useEffect, useMemo, useState } from "react";
import Input from "../Input/Input";
import { AppointmentResponse, AppointmentStatus } from "../../types";
import { appointmentService } from "../../services/appointmentService";
import { formatStatus } from "../../utils/helpers";

interface AppointmentPanelProps {
  appointmentId: string;
  onClose: () => void;
  onUpdated?: (appointment: AppointmentResponse) => void;
}

type FormData = {
  title: string;
  date: string; // yyyy-mm-dd
  status: AppointmentStatus;
  notes: string;
};

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-yellow-50 text-yellow-600",
  FINISHED: "bg-green-50 text-green-600",
  CANCELED: "bg-red-50 text-red-400",
};

function toDateInputValue(date: string) {
  // backend returns ISO date or yyyy-mm-dd; keep yyyy-mm-dd
  return date.includes("T") ? date.slice(0, 10) : date;
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}

function getApiErrorMessage(err: unknown, fallback: string) {
  const apiMessage = (err as any)?.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) return apiMessage;
  return err instanceof Error ? err.message : fallback;
}

export default function AppointmentPanel({
  appointmentId,
  onClose,
  onUpdated,
}: AppointmentPanelProps) {
  const [loading, setLoading] = useState(true);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [appointment, setAppointment] = useState<AppointmentResponse | null>(
    null,
  );

  const [formData, setFormData] = useState<FormData>({
    title: "",
    date: "",
    status: "PENDING",
    notes: "",
  });

  const [uploadedImages, setUploadedImages] = useState<
    Array<{ name: string; dataUrl: string }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchAppointment() {
      try {
        setLoading(true);
        setError(null);
        const data = await appointmentService.getById(appointmentId);
        if (cancelled) return;
        setAppointment(data);
        setFormData({
          title: data.title ?? "",
          date: toDateInputValue(data.date ?? ""),
          status: data.status,
          notes: data.notes ?? "",
        });
        setUploadedImages(
          data.imageUrl
            ? [{ name: "image", dataUrl: data.imageUrl }]
            : [],
        );
      } catch (err: unknown) {
        if (!cancelled) setError(getApiErrorMessage(err, "Erro ao carregar consulta."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAppointment();
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  const statusOptions = useMemo(
    () =>
      [
        { value: "PENDING" as const, label: formatStatus("PENDING") },
        { value: "FINISHED" as const, label: formatStatus("FINISHED") },
        { value: "CANCELED" as const, label: formatStatus("CANCELED") },
      ] satisfies Array<{ value: AppointmentStatus; label: string }>,
    [],
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSaveDetails() {
    if (!appointment) return;

    try {
      setSavingDetails(true);
      setError(null);
      const updated = await appointmentService.update(appointment.id, {
        title: formData.title.trim(),
        date: formData.date,
      });
      setAppointment(updated);
      onUpdated?.(updated);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao salvar detalhes."));
    } finally {
      setSavingDetails(false);
    }
  }

  async function handleStatusChange(nextStatus: AppointmentStatus) {
    if (!appointment) return;
    if (nextStatus === appointment.status) return;

    if (appointment.status !== "PENDING") {
      setError("Só é possível alterar o status enquanto a consulta estiver Pendente.");
      return;
    }

    // Backend atual só tem rotas para finalizar e cancelar.
    if (nextStatus === "PENDING") {
      setError("O backend não tem endpoint para voltar o status para Pendente.");
      return;
    }

    try {
      setSavingStatus(true);
      setError(null);
      const updated =
        nextStatus === "FINISHED"
          ? await appointmentService.finish(appointment.id)
          : await appointmentService.cancel(appointment.id);
      setAppointment(updated);
      setFormData((prev) => ({ ...prev, status: updated.status }));
      onUpdated?.(updated);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao atualizar status."));
    } finally {
      setSavingStatus(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const previews = await Promise.all(
      fileArray.map(async (file) => ({
        name: file.name,
        dataUrl: await fileToDataUrl(file),
      })),
    );

    setUploadedImages((prev) => [...prev, ...previews]);
  }

  function handleDeleteImage(index: number) {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSaveNotes() {
    if (!appointment) return;

    try {
      setSavingNotes(true);
      setError(null);
      const firstImage = uploadedImages[0]?.dataUrl ?? null;
      const updated = await appointmentService.updateNotes(appointment.id, {
        notes: formData.notes,
        imageUrl: firstImage,
      });
      setAppointment(updated);
      setFormData((prev) => ({ ...prev, notes: updated.notes ?? "" }));
      onUpdated?.(updated);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Erro ao salvar notas."));
    } finally {
      setSavingNotes(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="h-full min-h-screen pt-12 pb-12">
        <div className="w-full max-w-3xl mx-auto slide-in">
          <div className="bg-white rounded-2xl border-2 border-pink-300 overflow-hidden shadow-sm">
            <div className="h-20 bg-linear-to-br from-pink-400 via-rose-300 to-fuchsia-300 relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 bg-white/25 hover:bg-white/40 text-white rounded-full p-1.5 transition-colors"
                aria-label="Fechar"
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

            <div className="px-6 pt-5 pb-6">
              {loading && (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-pink-300 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && error && (
                <div className="bg-red-50 border border-red-100 text-red-400 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {error}
                </div>
              )}

              {!loading && appointment && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <Input
                        label="Título da consulta"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Ex: Retorno"
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Data"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:items-end">
                    <div className="flex-1">
                      <label className="text-sm font-semibold text-gray-600">
                        Status
                      </label>
                      <div className="mt-1.5 relative">
                        <select
                          value={formData.status}
                          onChange={(e) =>
                            handleStatusChange(
                              e.target.value as AppointmentStatus,
                            )
                          }
                          disabled={savingStatus || appointment.status !== "PENDING"}
                          className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:bg-white focus:border-pink-300 focus:ring-2 focus:ring-pink-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[appointment.status]}`}
                        >
                          {formatStatus(appointment.status)}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      disabled={savingDetails || savingStatus}
                      className="sm:w-44 py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {savingDetails ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar detalhes"
                      )}
                    </button>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Notas
                    </h3>
                    <div className="border-2 border-gray-100 rounded-xl overflow-hidden">
                      <textarea
                        rows={10}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        className="w-full resize-none p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-100"
                        placeholder="Escreva tudo o que quiser sobre a consulta..."
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
                            onChange={handleImageChange}
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
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
                        disabled={savingNotes}
                      >
                        Fechar
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="px-4 py-2 bg-pink-400 text-white rounded-lg text-sm hover:bg-pink-500 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {savingNotes ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          "Salvar notas"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
