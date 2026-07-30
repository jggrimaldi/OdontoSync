import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  DentistRequest,
  DentistResponse,
  DentistUpdateProfileRequest,
  DentistUpdateRequest,
} from "../types";
import { authService } from "../services/authService";

interface AuthContextType {
  token: string | null;
  dentist: DentistResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: DentistRequest) => Promise<void>;
  updateDentist: (data: DentistUpdateRequest) => Promise<DentistResponse>;
  updateDentistProfileImage: (
    data: DentistUpdateProfileRequest,
  ) => Promise<DentistResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [dentist, setDentist] = useState<DentistResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = authService.getToken();
    const storedDentist = authService.getCurrentDentist();

    if (storedToken && storedDentist) {
      setToken(storedToken);
      setDentist(storedDentist);
    }

    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const response = await authService.login({ email, password });
    setToken(response.token);
    setDentist(response.dentist);
  }

  async function register(data: DentistRequest) {
    const response = await authService.register(data);
    setToken(response.token);
    setDentist(response.dentist);
  }

  async function updateDentist(data: DentistUpdateRequest) {
    if (!dentist) {
      throw new Error("Dentista não encontrado.");
    }

    const updatedDentist = await authService.updateCurrentDentist(data);
    setDentist(updatedDentist);
    return updatedDentist;
  }

  async function updateDentistProfileImage(data: DentistUpdateProfileRequest) {
    if (!dentist) {
      throw new Error("Dentista não encontrado.");
    }

    const updatedDentist = await authService.updateCurrentDentistProfileImage(data);
    setDentist(updatedDentist);
    return updatedDentist;
  }

  function logout() {
    authService.logout();
    setToken(null);
    setDentist(null);
  }

  const value: AuthContextType = {
    token,
    dentist,
    isAuthenticated: !!token,
    isLoading,
    login,
    register,
    updateDentist,
    updateDentistProfileImage,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
