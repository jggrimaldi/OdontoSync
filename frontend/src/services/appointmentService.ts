import api from "./api";
import {
  AppointmentResponse,
  AppointmentRequest,
  AppointmentUpdateRequest,
  AppointmentNoteUpdateRequest,
} from "../types";

export const appointmentService = {
  getByPatient: async (patientId: string): Promise<AppointmentResponse[]> => {
    const response = await api.get<AppointmentResponse[]>(
      `/consultas/paciente/${patientId}`,
    );
    return response.data;
  },

  getAll: async (): Promise<AppointmentResponse[]> => {
    const response = await api.get<AppointmentResponse[]>("/consultas");
    return response.data;
  },

  getById: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.get<AppointmentResponse>(`/consultas/${id}`);
    return response.data;
  },

  create: async (data: AppointmentRequest): Promise<AppointmentResponse> => {
    const response = await api.post<AppointmentResponse>("/consultas", data);
    return response.data;
  },

  update: async (
    id: string,
    data: AppointmentUpdateRequest,
  ): Promise<AppointmentResponse> => {
    const response = await api.patch<AppointmentResponse>(
      `/consultas/${id}/detalhes`,
      data,
    );
    return response.data;
  },

  updateNotes: async (
    id: string,
    data: AppointmentNoteUpdateRequest,
  ): Promise<AppointmentResponse> => {
    const response = await api.patch<AppointmentResponse>(
      `/consultas/${id}/anotacao`,
      data,
    );
    return response.data;
  },

  finish: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.patch<AppointmentResponse>(`/consultas/${id}`);
    return response.data;
  },

  cancel: async (id: string): Promise<AppointmentResponse> => {
    const response = await api.patch<AppointmentResponse>(
      `/consultas/${id}/cancelar`,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/consultas/${id}`);
  },
};
