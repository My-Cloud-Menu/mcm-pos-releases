import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  GLOBAL_LOCAL_STORAGE_KEY,
  GlobalSetup,
  initialGlobalSetupConfiguration,
} from "../common/configurations";

interface GlobalStore {
  setup: GlobalSetup;
  saveSetup: (newSetup: GlobalSetup) => void;
}

const useGlobalStore = create<GlobalStore>()(
  persist(
    (set, get) => ({
      setup: initialGlobalSetupConfiguration,
      saveSetup: (newSetup: GlobalSetup) => {
        set(() => ({ setup: newSetup }));
      },
    }),
    {
      name: GLOBAL_LOCAL_STORAGE_KEY, // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage),
      version: 16,
      // ESTAS SON LAS PROPIEDADES QUE SE VAN A QUEDAR GUARDADA EN EL LOCALSTORAGE
      partialize: (state) => ({ setup: state.setup }),
    }
  )
);

export default useGlobalStore;
