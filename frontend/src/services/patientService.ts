import api from "./api";
import {
  PatientResponse,
  PatientRequest,
  PatientUpdateRequest,
  PatientNoteUpdateRequest,
} from "../types";

export const patientService = {
  getAll: async (): Promise<PatientResponse[]> => {
    const response = await api.get<PatientResponse[]>("/pacientes");
    return response.data;
  },

  getById: async (id: string): Promise<PatientResponse> => {
    const response = await api.get<PatientResponse>(`/pacientes/${id}`);
    return response.data;
  },

  create: async (data: PatientRequest): Promise<PatientResponse> => {
    const response = await api.post<PatientResponse>("/pacientes", data);
    return response.data;
  },

  update: async (
    id: string,
    data: PatientUpdateRequest,
  ): Promise<PatientResponse> => {
    const response = await api.patch<PatientResponse>(
      `/pacientes/${id}/detalhes`,
      data,
    );
    return response.data;
  },

  updateNotes: async (
    id: string,
    data: PatientNoteUpdateRequest,
  ): Promise<PatientResponse> => {
    const response = await api.patch<PatientResponse>(
      `/pacientes/${id}/anotacao`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/pacientes/${id}`);
  },
};
