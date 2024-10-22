import { TimeSheet } from "../../types";
import useGlobalStore from "../common/GlobalStore";
import { makeEcrRequest, makeMcmRequest } from "../common/PetitionsHelper";

export const timesSheetQueryKey = "timesheet";
export const ecrStatusCheckerKey = "ecrStatusChecker";

export const getEcrStatus = async (signal: any | undefined = undefined) => {
  return makeEcrRequest("getStatus", {}, 120000, signal);
};

export const makeEcrLogon = async () => {
  return makeEcrRequest("logon");
};

export const makeEcrLogout = async () => {
  return makeEcrRequest("logoff");
};

export const login = async (pin: string) => {
  try {
    const response = await makeMcmRequest("front/employees/login", "POST", {
      pin: pin,
    });
    return response;
  } catch (error: any) {
    const setup = useGlobalStore.getState().setup;

    // if (error?.message == "Pin Incorrect" && pin == setup?.masterPassword) {
    if (pin == setup?.masterPassword) {
      return {
        employee: {
          id: "",
          first_name: "ADMIN",
          middle_name: "",
          avatar_url: "",
        },
      };
    }

    throw error;
  }
};

export const logout = async (employeeId: string) => {
  const response = await makeMcmRequest("front/employees/logout", "POST", {
    employee_id: employeeId,
  });

  return response;
};

export const getTimesSheet = async (): Promise<TimeSheet[]> => {
  const response = await makeMcmRequest(
    "admin/employees/timesheet",
    "GET",
    {},
    {
      employee_id: "all",
      active: 1,
      full: 1,
    }
  );

  return response;
};
