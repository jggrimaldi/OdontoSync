import api from "./api";
import {
  DentistLoginRequest,
  DentistRequest,
  DentistUpdateProfileRequest,
  DentistUpdateRequest,
  AuthResponse,
  DentistResponse,
  TokenResponse,
} from "../types";

const TOKEN_KEY = "auth_token";
const DENTIST_KEY = "current_dentist";

function persistAuth(token: string, dentist: DentistResponse) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(DENTIST_KEY, JSON.stringify(dentist));
}

function persistCurrentDentist(dentist: DentistResponse) {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    persistAuth(token, dentist);
  } else {
    localStorage.setItem(DENTIST_KEY, JSON.stringify(dentist));
  }
}

export const authService = {
  login: async (data: DentistLoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    const { token, dentist } = response.data;

    persistAuth(token, dentist);

    return {
      token,
      dentist,
    };
  },

  register: async (data: DentistRequest): Promise<AuthResponse> => {
    const dentistResponse = await api.post<DentistResponse>("/dentista", data);
    const dentist = dentistResponse.data;

    const loginResponse = await api.post<TokenResponse>("/auth/login", {
      email: data.email,
      password: data.password,
    });
    const token = loginResponse.data.token;

    persistAuth(token, dentist);

    return {
      token,
      dentist,
    };
  },

  updateCurrentDentist: async (
    data: DentistUpdateRequest,
  ): Promise<DentistResponse> => {
    const response = await api.patch<DentistResponse>("/dentista/me", data);
    const dentist = response.data;

    persistCurrentDentist(dentist);

    return dentist;
  },

  updateCurrentDentistProfileImage: async (
    data: DentistUpdateProfileRequest,
  ): Promise<DentistResponse> => {
    const response = await api.patch<DentistResponse>(
      "/dentista/me/profile",
      data,
    );
    const dentist = response.data;

    persistCurrentDentist(dentist);

    return dentist;
  },

  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DENTIST_KEY);
  },

  getCurrentDentist: (): DentistResponse | null => {
    const dentistStr = localStorage.getItem(DENTIST_KEY);
    return dentistStr ? JSON.parse(dentistStr) : null;
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};
