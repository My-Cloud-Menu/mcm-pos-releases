import { Platform, StyleSheet } from "react-native";
import React from "react";
import WebView from "react-native-webview";

type props = {
  htmlContent: string;
};
const HtmlContent = (props: props) => {
  const contentToShow =
    `<style>
  * {font-size:35px !important;}
  img{width:50px;}
</style>` +
    props.htmlContent.replace(
      "ath_logo.png",
      "https://s3-sa-east-1.amazonaws.com/colaboral-companies-avatar/large/47544/imagen_evertec.png?1567438750"
    );

  if (Platform.OS == "web")
    return <div dangerouslySetInnerHTML={{ __html: contentToShow }} />;

  return (
    <WebView
      source={{
        html: contentToShow,
      }}
    />
  );
};

export default HtmlContent;

const styles = StyleSheet.create({});
