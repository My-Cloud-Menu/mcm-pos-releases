import { FontAwesome } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import useGlobalStore from "./GlobalStore";

type alertProps = {
  title: string;
  type: "warning" | "success" | "danger" | "info" | "default" | "none";
  description?: string;
  duration?: number;
};

const ecrErrorsAvailableToShow: any = {
  "NOT LOGGED ON.": "NOT LOGGED ON.",
  "TOO MUCH TIP.": "TOO MUCH TIP.",
  "ENTER PIN TIME OUT.": "ENTER PIN TIME OUT.",
  "COMMUNICATION ERROR.": "COMMUNICATION ERROR.",
  "ENTER PIN CANCEL.": "ENTER PIN CANCEL.",
  "PLEASE SETTLE SOON.": "PLEASE SETTLE SOON.",
  "SETTLEMENT REQUIRED.": "SETTLEMENT REQUIRED.",
  "MUST SETTLE.": "MUST SETTLE.",
  "TRANSACTION NOT ALLOWED.": "TRANSACTION NOT ALLOWED.",
  "INVALID SESSION ID.": "INVALID SESSION ID.",
  "EXCEEDS TIP ADJUSTS.": "EXCEEDS TIP ADJUSTS.",
  "EXCEEDS PIN RETRIES.": "EXCEEDS PIN RETRIES.",
  "TRANSACTION CANCELLED CARD REMOVED.": "TRANSACTION CANCELLED CARD REMOVED.",
  "TRANSACTION CANCELLED.": "TRANSACTION CANCELLED",
  "TRANSACTION TIMED OUT.": "TRANSACTION TIMED OUT",
};

export const handlePetitionError = (error: any) => {
  const ecrMessageError =
    ecrErrorsAvailableToShow[(error?.response_message || "").toUpperCase()];

  if (ecrMessageError) {
    showAlert({ title: ecrMessageError, type: "warning" });
    return;
  }

  if (error?.message == "Network Error") {
    showAlert({
      title: "Network Error",
      description:
        "Please check the internet connection. If error persist contact to Admin",
      type: "danger",
    });
    return;
  }

  const setup = useGlobalStore.getState().setup;

  if (setup.showErrors) {
    showAlert({
      title: "Something went wrong",
      description: JSON.stringify(error),
      type: "danger",
    });

    return;
  }

  showAlert({
    title: "Something went wrong",
    description: "Please, try again or check console for details",
    type: "danger",
  });

  console.log(error);
};

export const showAlert = (props: alertProps) => {
  showMessage({
    message: props.title,
    description: props.description,
    type: props.type,
    duration: props.duration || 5000,
    style: { paddingBottom: 30, margin: 3, borderRadius: 10 },
    titleStyle: { fontSize: 24 },
    icon: () => {
      if (props.type == "warning") {
        return (
          <FontAwesome
            name="warning"
            size={17}
            color="#fff"
            style={{ marginRight: 10 }}
          />
        );
      }
      return undefined;
    },
  });
};

export const showWarningAlert = (title = "") => {
  showMessage({
    message: title,
    type: "warning",
    icon: () => (
      <FontAwesome
        name="warning"
        size={17}
        color="#fff"
        style={{ marginRight: 10 }}
      />
    ),
  });
};
