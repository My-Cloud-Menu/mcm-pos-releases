import { StyleSheet, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib";
import { handlePetitionError } from "../../common/AlertHelper";
import { sendSMSNotification } from "../ReceiptApi";
import { useMutation } from "@tanstack/react-query";
import {
  formatPhoneNumber,
  formatPhoneNumberForBackend,
  verifyIfNumberIsValid,
} from "../ReceiptHelper";

type props = {
  paymentId: string;
};

const SendReceiptBySmsForm = (props: props) => {
  const [inputValue, setInputValue] = useState("");

  const sendSmsQuery = useMutation({
    mutationFn: (props: { paymentId: string; phoneNumber: string }) =>
      sendSMSNotification(props.paymentId, props.phoneNumber),
    onError: (error: any) => handlePetitionError(error),
  });

  const onPressSendSms = () => {
    if (sendSmsQuery.isSuccess) {
      sendSmsQuery.reset();
      return;
    }

    if (sendSmsQuery.isLoading) return;

    const phoneFormatted = formatPhoneNumberForBackend(inputValue);

    sendSmsQuery.mutate({
      paymentId: props.paymentId,
      phoneNumber: phoneFormatted,
    });
  };

  return (
    <View centerV>
      <Text text40 center marginT-10 marginB-30>
        Send SMS
      </Text>
      <TextField
        containerStyle={{
          borderBottomWidth: 2,
          borderColor: Colors.primary,
          marginHorizontal: 15,
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 10,
        }}
        style={{
          fontSize: 27,
          marginTop: 10,
        }}
        label="Phone Number"
        labelColor={"#000"}
        placeholderTextColor={Colors.gray}
        value={inputValue}
        placeholder="(000) 000-000"
        formatter={formatPhoneNumber}
        onChangeText={setInputValue}
        maxLength={30}
        keyboardType="numeric"
        leadingAccessory={
          <Text style={{ fontSize: 27, marginTop: 8 }}>+1 </Text>
        }
      />
      <Button
        marginH-30
        marginT-50
        onPress={onPressSendSms}
        disabled={!verifyIfNumberIsValid(inputValue)}
        label={
          sendSmsQuery.isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : sendSmsQuery.isSuccess ? (
            "SMS Sent Successfully"
          ) : (
            "Send SMS"
          )
        }
        style={{
          backgroundColor: sendSmsQuery.isSuccess
            ? Colors.green
            : Colors.primary,
        }}
      />
    </View>
  );
};

export default SendReceiptBySmsForm;

const styles = StyleSheet.create({});
