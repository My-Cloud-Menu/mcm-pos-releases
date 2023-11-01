import { makeEcrRequest, makeMcmRequest } from "../common/PetitionsHelper";
import * as Linking from "expo-linking";

export const getQrCodeReceiptUrl = async (paymentId: string) => {
  return await makeMcmRequest(`front/payments/${paymentId}/receipturl`);
};

export const printECRCustomReceipt = async (htmlReceipt: string) => {
  try {
    const data = {
      receipt_output: htmlReceipt,
    };

    const response = await makeEcrRequest("customPrint", data);
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    return response;
  } catch (error) {
    try {
      !__DEV__ && Linking.openURL("mcmpos://");
    } catch (err) {}
    throw error;
  }
};

export const sendSMSNotification = async (
  payment_id: string,
  phoneNumber: string
) => {
  return await makeMcmRequest(`admin/notifications/sms`, "POST", {
    phone: phoneNumber,
    payment_id: payment_id,
  });
};
