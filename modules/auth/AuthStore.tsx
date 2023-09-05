import { create } from "zustand";
import * as authApi from "./AuthApi";

const useAuthStore = create((set, get) => ({
  isLoading: false,
  isLogged: false,
  error: null,
  employeeLogged: null,
  login: async (pin: string) => {
    set(() => ({ isLoading: true, error: null }));

    try {
      const loginResponse = await authApi.login(pin);

      set(() => ({ employeeLogged: loginResponse.employee, isLogged: true }));

      return loginResponse;
    } catch (error: any) {
      let errorMessage = "Something went wrong";

      if (error?.message == "Pin Incorrect") errorMessage = "Pin Incorrect";

      set(() => ({ isLoading: false, error: errorMessage }));

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
