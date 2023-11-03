import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import MasterPasswordRequired from "../../common/components/MasterPasswordRequired";
import { TabController, Text, View } from "react-native-ui-lib";
import EcrSetupForm from "./EcrSetupForm";
import GeneralSetupForm from "./GeneralSetupForm";

const tabOptions = [{ label: "ECR Setup" }, { label: "General Setup" }];

const SettingsScreen = () => {
  return (
    <MasterPasswordRequired useDevPassword>
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <TabController items={tabOptions}>
          <TabController.TabBar enableShadow />
          <View flex>
            <TabController.TabPage index={0}>
              <EcrSetupForm />
            </TabController.TabPage>
            <TabController.TabPage index={1} lazy>
              <GeneralSetupForm />
            </TabController.TabPage>
          </View>
        </TabController>
      </ScrollView>
    </MasterPasswordRequired>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({});
