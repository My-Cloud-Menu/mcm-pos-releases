import { TimeSheet } from "../../types";
import { makeMcmRequest } from "../common/PetitionsHelper";

export const timesSheetQueryKey = "timesheet";

export const login = async (pin: string) => {
  const response = await makeMcmRequest("front/employees/login", "POST", {
    pin: pin,
  });

  return response;
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
