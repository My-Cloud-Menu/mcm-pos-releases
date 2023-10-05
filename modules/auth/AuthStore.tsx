import { create } from "zustand";
import * as authApi from "./AuthApi";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_LOCAL_STORAGE_KEY } from "../common/configurations";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthStore {
  isLoading: boolean;
  isLogged: boolean;
  error: any;
  employeeLogged?: {
    id: string;
    birthday?: string;
    check_name: string;
    email: string;
    first_name: string;
    last_name: string;
    login: string;
    middle_name?: string;
    payroll_id?: string;
    phone?: string;
    pos_id?: string;
    start_date?: string;
    role: "admin" | "waiter";
  };
  login: (pin: string) => Promise<any>;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isLogged: false,
      error: null,
      employeeLogged: undefined,
      login: async (pin: string) => {
        set(() => ({ isLoading: true, error: null }));

        try {
          if (!pin) throw { message: "Pin Required" };

          const loginResponse = await authApi.login(pin);

          set(() => ({
            employeeLogged: loginResponse.employee,
            isLogged: true,
            isLoading: false,
          }));

          return loginResponse;
        } catch (error: any) {
          let errorMessage = "Something went wrong";

          if (error?.message == "Pin Incorrect") errorMessage = "Pin Incorrect";
          if (error?.message == "Pin Required") errorMessage = "Pin Required";

          set(() => ({ isLoading: false, error: errorMessage }));

          throw error;
        }
      },
      logout: async () => {
        set(() => ({ isLoading: true, error: null }));

        const employeeId = get()?.employeeLogged?.id || "";

        try {
          const logoutResponse = await authApi.logout(employeeId);
          set(() => ({ isLoading: false, employeeLogged: undefined }));

          return logoutResponse;
        } catch (error: any) {
          const errorMessage = error?.message;

          set(() => ({ isLoading: false, error: errorMessage }));

          throw error;
        }
      },
    }),
    {
      name: AUTH_LOCAL_STORAGE_KEY, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
      version: 5,
      // THOSE PROPERTIES LISTED HERE WILL KEEP SAVED IN LOCAL_STORAGE
      partialize: (state) => ({ employeeLogged: state.employeeLogged }),
    }
  )
);

export default useAuthStore;
