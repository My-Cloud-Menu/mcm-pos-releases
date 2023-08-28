import { makeMcmRequest } from "../common/PetitionsHelper";

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
