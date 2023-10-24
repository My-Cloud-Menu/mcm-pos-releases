import { FontAwesome } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

type alertProps = {
  title: string;
  type: "warning" | "success" | "danger" | "info" | "default" | "none";
  description?: string;
  duration?: number;
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
