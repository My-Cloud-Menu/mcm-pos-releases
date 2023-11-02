import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();
const countryCode = "US";

export const verifyIfNumberIsValid = (value: string) => {
  try {
    if (!value) return false;

    return phoneUtil.isValidNumber(
      phoneUtil.parseAndKeepRawInput(value, countryCode)
    );
  } catch {
    return false;
  }
};

export const formatPhoneNumber = (value: string) => {
  try {
    return phoneUtil.format(
      phoneUtil.parseAndKeepRawInput(value, countryCode),
      PhoneNumberFormat.NATIONAL
    );
  } catch {
    return value;
  }
};

export const formatPhoneNumberForBackend = (value: string) => {
  return phoneUtil.format(
    phoneUtil.parseAndKeepRawInput(value, countryCode),
    PhoneNumberFormat.E164
  );
};

export const getPaymentStatusForReceipt = (paymentStatus: string) => {
  if (paymentStatus == "completed") return "Approved.";
  if (paymentStatus == "refunded") return "Refunded.";
  if (paymentStatus == "partially_refunded") return "Partially Refunded.";

  return "Pending.";
};
