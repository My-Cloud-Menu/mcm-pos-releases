import { FontAwesome } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

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
