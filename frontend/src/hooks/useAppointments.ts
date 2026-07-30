import { useCallback, useEffect, useState } from "react";
import { AppointmentResponse } from "../types";
import { appointmentService } from "../services/appointmentService";
import { mockAppointments } from "../mocks/data";

const USE_MOCK = false;

export function useAppointments(patientId: string | null) {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!patientId) {
      setAppointments([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = USE_MOCK
        ? mockAppointments
        : await appointmentService.getByPatient(patientId);
      setAppointments(data);
    } catch {
      setError("Erro ao carregar consultas.");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, refetch: fetchAppointments };
}
