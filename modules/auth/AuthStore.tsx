import { create } from "zustand";
import * as authApi from "./AuthApi";

const useAuthStore = create((set, get) => ({
  isLoading: false,
  isLogged: false,
  employeeLogged: null,
  login: async (pin) => {
    set(() => ({ isLoading: true }));

    try {
      const loginResponse = await authApi.login(pin);

      set(() => ({ employeeLogged: loginResponse.employee, isLogged: true }));

      return loginResponse;
    } catch (error) {
      set(() => ({ isLoading: false }));

      throw error;
    }
  },
  logout: async () => {
    const employeeId = get()?.employeeLogged?.id;

    try {
      const logoutResponse = await authApi.login(employeeId);

      return logoutResponse;
    } catch (error) {
      throw error;
    }
  },
}));

export default useAuthStore;
