// ─── Enums ────────────────────────────────────────────────
export type AppointmentStatus = "PENDING" | "FINISHED" | "CANCELED";

// ─── Patient ──────────────────────────────────────────────
export interface PatientResponse {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  age: number | null;
  notes: string | null;
  imageUrl: string | null;
}

export interface PatientRequest {
  name: string;
  cpf: string;
  phone: string;
  age: number;
}

export interface PatientUpdateRequest {
  name: string;
  phone: string;
  age: number;
}

export interface PatientNoteUpdateRequest {
  notes: string;
  imageUrl: string | null;
}

// ─── Appointment ──────────────────────────────────────────
export interface AppointmentResponse {
  id: string;
  date: string;
  title: string;
  notes: string | null;
  imageUrl: string | null;
  status: AppointmentStatus;
  patientName: string;
  patientPhone: string;
  dentistName: string;
  dentistId: string;
  updatedAt: string;
}

export interface AppointmentRequest {
  patientId: string;
  title: string;
  date: string;
}

export interface AppointmentUpdateRequest {
  title: string;
  date: string;
}

export interface AppointmentNoteUpdateRequest {
  notes: string;
  imageUrl: string | null;
}

// ─── Dentist ──────────────────────────────────────────────
export interface DentistResponse {
  id: string; // UUID
  name: string;
  email: string;
  cro: string | null;
  role: string;
  imageUrl: string | null;
}

export interface DentistRequest {
  name: string;
  email: string;
  password: string;
  cro?: string | null;
}

export interface DentistUpdateRequest {
  name: string;
  email: string;
  password?: string;
  cro?: string | null;
}

export interface DentistUpdateProfileRequest {
  imageUrl: string | null;
}

export interface DentistLoginRequest {
  email: string;
  password: string;
}

// ─── Auth ─────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  token: string;
}

export interface AuthResponse {
  token: string;
  dentist: DentistResponse;
}
