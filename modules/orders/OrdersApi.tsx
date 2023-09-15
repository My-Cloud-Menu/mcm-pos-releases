import { makeMcmRequest } from "../common/PetitionsHelper";

export const createOrderInBackend = async (cartData: any) => {
  const response = await makeMcmRequest("front/carts", "POST", cartData);

  return response;
};
