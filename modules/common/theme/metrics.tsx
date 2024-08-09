import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

const metrics = {
  screenWidth: width,
  screenHeigth: height,
};

export default metrics;
