import { useQuery } from "@tanstack/react-query";
import { getSetting, settingQueryKey } from "../SettingsApi";

const getFeatureFlag = (settings: any, flag: string) => {
  settings.Features = settings?.Features || [];

  return settings.Features.includes(flag);
};

const useSetting = () => {
  const settingQuery = useQuery({
    queryKey: [settingQueryKey],
    queryFn: getSetting,
    initialData: {
      Features: [],
    },
    select: (data) => {
      console.log("settings", data);

      // data.Features = ["pos_prod_menu_no_image"];

      return data;
    },
  });

  console.log(settingQuery.data);

  return {
    settings: settingQuery.data,
    getFeatureFlag: (flag: string) => getFeatureFlag(settingQuery.data, flag),
  };
};

export default useSetting;
