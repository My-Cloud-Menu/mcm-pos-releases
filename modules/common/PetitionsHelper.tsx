import axios from "axios";
import { getAdvancedSetup, getEcrSetup, saveEcrSetup } from "./SetupHelper";

// const apiBaseUrl = "https://api.mycloudmenu.com";
// const mcmApiKey =
//   "dAk3R3g18AZBMxHEP5PQGDkN8H6sqJnCGz7QCnkz039QNPop9nh74fLIj5S2U0vI6ykrVJ8IbX8vV6Hv5koFMuR2DTNzxq7CHY3pl7KL1NkFF4OPQLa7K3VNEpl3ITLxN5o62fNKM91ErdrrzHwTjrKjGUTIRB8P";

// export const siteId = "1020501";

const mcmApiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXRoIjpbIkFMTF9BQ0NFU1MiXSwiaWF0IjoxNjc0ODI5MDIzfQ.x1b5y2-Jy6jJSgVY0fce5aVWMHa2PbSpvpHrUSerpEU";

export const getMcmRequestUrl = async (pathName) => {
  const advanceSetup = await getAdvancedSetup();

  return `${advanceSetup?.url}/${pathName}`;
};

export const getMcmRequestHeaders = () => {
  return {
    mcm_api_key: mcmApiKey,
    "Content-Type": "application/json",
  };
};

export const makeMcmRequest = async (
  path = "",
  method = "GET",
  body = {},
  params = {}
) => {
  const url = await getMcmRequestUrl(path);
  const headers = getMcmRequestHeaders();

  const advancedSetup = await getAdvancedSetup();

  const siteId = advancedSetup?.siteId;
  try {
    const { data } = await axios.request({
      method: method,
      headers: headers,
      data: { site_id: siteId, ...body },
      params: { site_id: siteId, ...params },
      url: url,
      timeout: 20000,
    });

    return data;
  } catch (error) {
    error =
      error?.response?.data || error?.request?.data || error?.request || error;

    throw error;
  }
};

// ECR FUNCTIONS
export const getEcrRequestInitialBody = async (isLogged = true) => {
  let ecrConfiguration = await getEcrSetup();

  // Increment Reference Sequence
  const actualReference = Number(ecrConfiguration?.reference || 0);
  const newReference = actualReference == 999999 ? 1 : actualReference + 1;
  //

  let newConfiguration = {
    ...ecrConfiguration,
    reference: newReference,
  };

  await saveEcrSetup(newConfiguration);

  let initialBody = {
    terminal_id: newConfiguration.terminal_id,
    cashier_id: newConfiguration.cashier_id,
    station_number: newConfiguration.station_number,
    reference: newConfiguration.reference.toString(),
  };

  if (newConfiguration?.last_reference)
    initialBody.last_reference = newConfiguration.last_reference;

  if (isLogged) initialBody.session_id = newConfiguration?.session_id;

  return initialBody;
};

export const getEcrRequestHeaders = async () => {
  let ecrConfiguration = await getEcrSetup();

  return {
    api_key: ecrConfiguration.api_key,
    "Content-Type": "application/json",
  };
};

export const getEcrRequestUrl = async (pathName = "") => {
  let ecrConfiguration = await getEcrSetup();

  const url = __DEV__
    ? `${ecrConfiguration.ipDev}/${pathName}`
    : `http://${ecrConfiguration.ip}:${ecrConfiguration.port}/${pathName}`;

  return url;
};

export const makeEcrRequest = async (
  path = "",
  data = {},
  customTimeout = null
) => {
  const isLogged = path != "logon";

  let ecrRequestInitialBody = await getEcrRequestInitialBody(isLogged);
  const url = await getEcrRequestUrl(path);
  const headers = await getEcrRequestHeaders();
  const bodyParameters = { ...ecrRequestInitialBody, ...data };

  try {
    const { data } = await axios.request({
      method: "POST",
      data: bodyParameters,
      headers: headers,
      url: url,
      timeout: customTimeout || 30000,
    });

    if (data?.approval_code == "00") {
      if (path == "logon") await updateEcrSessionId(data);

      await updateLastReferenceSuccessful(data.reference);

      return data;
    }
    throw data;
  } catch (error) {
    error = error?.response?.data || error?.response || error;

    throw error;
  }
};

export const updateEcrSessionId = async (logonResponse) => {
  let ecrConfiguration = await getEcrSetup();

  let newConfiguration = {
    ...ecrConfiguration,
    session_id: logonResponse.session_id,
  };

  await saveEcrSetup(newConfiguration);
  return true;
};

export const updateLastReferenceSuccessful = async (reference) => {
  let ecrConfiguration = await getEcrSetup();

  let newConfiguration = {
    ...ecrConfiguration,
    last_reference: reference,
  };

  await saveEcrSetup(newConfiguration);
  return true;
};
