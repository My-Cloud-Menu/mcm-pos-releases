import { create } from "zustand";
import * as authApi from "./AuthApi";
import { createJSONStorage, persist } from "zustand/middleware";
import { AUTH_LOCAL_STORAGE_KEY } from "../common/configurations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Employee } from "mcm-types";
import { formatErrorMessage } from "./components/ClockInScreen";

interface AuthStore {
  isLoading: boolean;
  isLogged: boolean;
  error: any;
  employeeLogged?: Employee;
  login: (pin: string) => Promise<any>;
  logout: () => Promise<any>;
  changeCurrentEmployeeLogged: (newEmployee: Employee) => void;
  removeCurrentEmployeeLogged: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isLogged: false,
      error: null,
      employeeLogged: undefined,
      removeCurrentEmployeeLogged: () => {
        set(() => ({ employeeLogged: undefined }));
      },
      changeCurrentEmployeeLogged: (newEmployee) => {
        set(() => ({ employeeLogged: newEmployee }));
      },
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
          let errorMessage: string | undefined = undefined;

          if (error?.message == "Pin Incorrect") errorMessage = "Pin Incorrect";
          if (error?.message == "Pin Required") errorMessage = "Pin Required";

          set(() => ({
            isLoading: false,
            error: errorMessage || formatErrorMessage(error),
          }));

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

          if (error?.message == "No Time Sheet Available for Logout") {
            set(() => ({ isLoading: false, employeeLogged: undefined }));
            return;
          }
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
