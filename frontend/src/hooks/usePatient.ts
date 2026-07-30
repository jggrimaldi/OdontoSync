import { useState, useEffect } from "react";
import { PatientResponse } from "../types";
import { patientService } from "../services/patientService";
import { mockPatients } from "../mocks/data";

// Troca para false quando o backend estiver rodando
const USE_MOCK = false;

export function usePatients() {
  const [patients, setPatients] = useState<PatientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchPatients() {
    try {
      setLoading(true);
      setError(null);
      const data = USE_MOCK
        ? mockPatients
        : await patientService.getAll();
      setPatients(data);
    } catch {
      setError("Erro ao carregar pacientes. Verifique se o backend está rodando.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  // Adiciona o paciente diretamente no estado — funciona com mock e com API real
  function addPatient(newPatient: PatientResponse) {
    setPatients((prev) => [newPatient, ...prev]);
  }

  function updatePatient(updatedPatient: PatientResponse) {
    setPatients((prev) =>
      prev.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient,
      ),
    );
  }

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
    addPatient,
    updatePatient,
  };
}
