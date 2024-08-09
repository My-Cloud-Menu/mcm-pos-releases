import { ImageStyle, StyleProp } from "react-native";
import { Image } from "react-native-ui-lib";

export const getLogoComponent = (props: {
  settings: any;
  styles?: StyleProp<ImageStyle>;
}) => {
  props.styles = props.styles || { width: 50, height: 50, borderRadius: 6 };

  if (props.settings?.Brand?.Logo) {
    console.log("props.settings?.Brand?.Logo", props.settings?.Brand?.Logo);
    return (
      <Image
        source={{ uri: props.settings?.Brand?.Logo }}
        style={props.styles}
      />
    );
  }

  return (
    <Image
      resizeMode="contain"
      style={props.styles}
      assetGroup="assets"
      assetName="logoMain"
    />
  );
};
