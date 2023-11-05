import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ECR_LOCAL_STORAGE_KEY,
  EcrSetup,
  initialECRSetupConfiguration,
} from "../common/configurations";
import { makeEcrRequest } from "../common/PetitionsHelper";

interface EcrStore {
  isLoading: boolean;
  isLogged: boolean;
  error: any;
  setup: EcrSetup;
  login: () => Promise<any>;
  saveSetup: (newSetup: EcrSetup) => void;
  setCurrentBachNumber: (newBatchNumber: string) => void;
  increaseCurrentBatchNumber: () => void;
}

const useEcrStore = create<EcrStore>()(
  persist(
    (set, get) => ({
      isLoading: false,
      isLogged: false,
      error: null,
      setup: initialECRSetupConfiguration,
      setCurrentBachNumber: (newBatchNumber) =>
        set((state) => ({
          setup: { ...state.setup, batch_number: newBatchNumber },
        })),
      increaseCurrentBatchNumber: () => {
        let { batch_number } = get().setup;

        if (!isNaN(batch_number) && batch_number != null) {
          batch_number = (Number(batch_number) + 1).toString();
        }

        set((state) => ({
          setup: { ...state.setup, batch_number: batch_number },
        }));
      },
      saveSetup: (newSetup: EcrSetup) => {
        set(() => ({ setup: newSetup }));
      },
      login: async () => {
        set(() => ({ isLoading: true, error: null }));

        try {
          const loginResponse = await makeEcrRequest("logon");

          set(() => ({
            isLogged: true,
            isLoading: false,
          }));

          return loginResponse;
        } catch (error: any) {
          let errorMessage = "Something went wrong";

          console.log(errorMessage);

          set(() => ({ isLoading: false, error: errorMessage }));

          throw error;
        }
      },
    }),
    {
      name: ECR_LOCAL_STORAGE_KEY, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
      version: 6,
      // THOSE PROPERTIES LISTED HERE WILL KEEP SAVED IN LOCAL_STORAGE
      partialize: (state) => ({ setup: state.setup }),
    }
  )
);

export default useEcrStore;
