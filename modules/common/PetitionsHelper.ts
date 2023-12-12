import axios from "axios";
import useEcrStore from "../ecr/EcrStore";
import useGlobalStore from "./GlobalStore";
import { showAlert } from "./AlertHelper";

axios.interceptors.response.use(
  (response) => {
    if (response.data?.approval_code && response.data?.approval_code != "00") {
      sendLogs(response, "ECR Request Failed");
    }

    return response;
  },
  (err) => {
    sendLogs(err, "Request Failed");

    throw err;
  }
);

export const onRequestError = (
  error: any,
  title: string = "",
  description: string = ""
) => {
  if (
    [
      "InvalidParameterException",
      "ValidationException",
      "UsernameExistsException",
    ].includes(error?.code) &&
    error?.message
  ) {
    showAlert({
      type: "danger",
      title: title,
      description: JSON.stringify(error.message),
    });
  } else {
    showAlert({
      type: "danger",
      title: title,
      description:
        description || "Please try again, if error persist contact to admin",
    });
  }
};

export const makeMcmRequest = async (
  path: string = "",
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body = {},
  params = {}
) => {
  const { setup } = useGlobalStore.getState();

  const url = `${setup.url}/${path}`;

  const headers = {
    mcm_api_key: setup.apiKey,
    "Content-Type": "application/json",
  };

  try {
    const { data } = await axios.request({
      method: method,
      headers: headers,
      data: method == "GET" ? undefined : { site_id: setup.siteId, ...body },
      params: { site_id: setup.siteId, ...params },
      url: url,
      timeout: 420000,
    });

    return data;
  } catch (error: any) {
    error =
      error?.response?.data || error?.request?.data || error?.request || error;
    console.log(error);
    throw error;
  }
};

export const makeEcrRequest = async (
  path: string,
  body?: object,
  timeout = 30000,
  signal: any | undefined = undefined
) => {
  try {
    const initialBody = getEcrRequestInitialBody();
    const headers = getEcrRequestHeaders();
    const url = getEcrRequestUrl(path);
    let bodyParameters = { ...initialBody, ...body };

    if (path == "logon") {
      bodyParameters.session_id = undefined;
    }

    const { data } = await axios.request({
      method: "POST",
      data: bodyParameters,
      headers: headers,
      url: url,
      signal: signal,
      timeout: 420000,
    });

    if (data?.approval_code == "00") {
      onSuccessfulECRResponse(data, path);

      return data;
    }

    throw data;
  } catch (error: any) {
    error = error?.response?.data || error?.response || error;

    throw error;
  }
};

export const onSuccessfulECRResponse = (data: any, path: string) => {
  let { setup, saveSetup } = useEcrStore.getState();

  if (path == "logon") {
    setup.session_id = data.session_id;
    setup.reference = data.reference;
  }

  setup.last_reference = data.reference;

  saveSetup(setup);
  return true;
};

export const getEcrRequestUrl = (pathName: string = "") => {
  let { setup } = useEcrStore.getState();

  let url: string = __DEV__
    ? `${setup.ipDev}/${pathName}`
    : `${setup.ip}:${setup.port}/${pathName}`;

  // let url: string = `${setup.ip}:${setup.port}/${pathName}`;

  return url;
};

const getEcrRequestHeaders = (): object => {
  let { setup } = useEcrStore.getState();

  return {
    api_key: setup.api_key,
    "Content-Type": "application/json",
  };
};

const getEcrRequestInitialBody = () => {
  let { setup, saveSetup } = useEcrStore.getState();

  // INCREMENT SEQUENCE
  const actualReference = Number(setup.reference || 0);
  const newReference = actualReference == 999999 ? 1 : actualReference + 1;

  setup.reference = newReference;
  saveSetup(setup);
  //

  let initialBody: any = {
    terminal_id: setup.terminal_id,
    cashier_id: setup.cashier_id,
    station_number: setup.station_number,
    reference: setup.reference.toString(),
  };

  initialBody.last_reference = setup?.last_reference
    ? setup.last_reference.toString()
    : "";

  if (setup?.session_id) initialBody.session_id = setup.session_id;

  return initialBody;
};

export const sendLogs = (
  log: any,
  source = "Request Error",
  trackingCode = null,
  type = "errors"
) => {
  // if (__DEV__) {
  //   console.log(log);
  //   return;
  // }

  let logMessage = "App: POS\n";
  logMessage += `Type: ${type}\n`;
  logMessage += `Source: ${source}\n`;

  if (trackingCode) {
    logMessage += `TrackingCode: ${trackingCode}\n`;
  }

  logMessage += `\n${JSON.stringify(log)}\n`;

  makeMcmRequest("admin/logs", "POST", {
    app: "orderandpay",
    logs: logMessage,
    type: type,
  })
    .then()
    .catch();
};
