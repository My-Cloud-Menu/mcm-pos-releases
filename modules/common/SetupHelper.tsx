import AsyncStorage from "@react-native-async-storage/async-storage";

import defaultSetupConfigurations from "../../..../../defaultSetupConfigurations.json";

const GENERAL_SETUP_KEY = "GENERAL_SETUP";
const ADVANCED_SETUP_KEY = "PREFERENCES_SETUP";
const ECR_PREFERENCES_SETUP_KEY = "ECR_PREFERENCES_SETUP";
const ECR_SETUP_KEY = "EVERTEC_API_SETUP";

export const defaultECRPreferencesSetup = {
  force_duplicate: "no",
  receipt_output: "HTML",
  manual_entry_indicator: "no",
  receipt_email: "no",
  process_cashback: "no",
};

export const getGeneralSetup = async () => {
  let generalSetup;

  try {
    generalSetup = JSON.parse(await AsyncStorage.getItem(GENERAL_SETUP_KEY));
  } catch (error) {
    console.log("Error getting General setup", error);
  }
  return generalSetup || defaultSetupConfigurations.general;
};

export const getAdvancedSetup = async () => {
  let preferencesSetup;
  try {
    preferencesSetup = JSON.parse(
      await AsyncStorage.getItem(ADVANCED_SETUP_KEY)
    );
  } catch (error) {
    console.log("Error getting preferences setup", error);
  }

  return preferencesSetup || defaultSetupConfigurations.advanced;
};

export const saveAdvancedSetup = async (newValues) => {
  await AsyncStorage.setItem(ADVANCED_SETUP_KEY, JSON.stringify(newValues));
};

export const saveECRPreferencesSetup = async (newValues) => {
  await AsyncStorage.setItem(
    ECR_PREFERENCES_SETUP_KEY,
    JSON.stringify(newValues)
  );
};

export const getECRPreferencesSetup = async () => {
  let preferencesSetup;
  try {
    preferencesSetup = JSON.parse(
      await AsyncStorage.getItem(ECR_PREFERENCES_SETUP_KEY)
    );
  } catch (error) {
    console.log("Error getting ECR preferences setup", error);
  }

  return preferencesSetup || defaultECRPreferencesSetup;
};

export const saveGeneralSetup = async (newValues) => {
  await AsyncStorage.setItem(GENERAL_SETUP_KEY, JSON.stringify(newValues));
};

export const getAdminConfiguration = async () => {
  return defaultSetupConfigurations.adminConfiguration;
};

export const getDevPassword = () => {
  return defaultSetupConfigurations.devPassword;
};

export const getEcrSetup = async () => {
  let ecrSetup;

  try {
    ecrSetup = JSON.parse(await AsyncStorage.getItem(ECR_SETUP_KEY));
  } catch (error) {
    console.log("Error getting ECR setup", error);
  }

  return ecrSetup || defaultSetupConfigurations.ecrSetup;
};

export const saveEcrSetup = async (newValues) => {
  await AsyncStorage.setItem(ECR_SETUP_KEY, JSON.stringify(newValues));
};
