import metrics from "./metrics";

const fonts = {
  size: {
    xs: Math.round(metrics.screenWidth * (10 / 365)),
    sm: Math.round(metrics.screenWidth * (13 / 365)),
    md: Math.round(metrics.screenWidth * (16 / 365)),
    lg: Math.round(metrics.screenWidth * (20 / 365)),
    xl: Math.round(metrics.screenWidth * (26 / 365)),
    xxl: Math.round(metrics.screenWidth * (34 / 365)),
  },
  weight: {
    bold: "bold",
    low: "400",
    semi: "600",
    full: "900",
  },
  type: {},
};

export default fonts;
