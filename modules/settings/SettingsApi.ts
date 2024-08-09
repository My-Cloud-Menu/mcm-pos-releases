import useGlobalStore from "../common/GlobalStore";
import { makeMcmRequest } from "../common/PetitionsHelper";

export const settingQueryKey = "setting";

export const getSetting = () => {
  const setup = useGlobalStore.getState().setup;

  return makeMcmRequest(`front/settings/${setup.siteId}`, "GET");
};
