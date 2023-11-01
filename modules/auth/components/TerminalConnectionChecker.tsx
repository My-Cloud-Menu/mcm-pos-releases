import { ActivityIndicator, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Button, Text, View } from "react-native-ui-lib";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getEcrStatus, makeEcrLogon } from "../AuthApi";
import { handlePetitionError } from "../../common/AlertHelper";

const TerminalConnectionChecker = () => {
  const [isReconnected, setIsReconnected] = useState(false);

  const ecrStatusQuery = useQuery({
    queryKey: ["ecrStatusChecker"],
    queryFn: getEcrStatus,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const ecrLoginQuery = useMutation({
    mutationFn: makeEcrLogon,
    onError: (error) => handlePetitionError(error),
    onSuccess: () => {
      setIsReconnected(true);
    },
  });

  if (!ecrStatusQuery.isError || isReconnected) return <></>;

  return (
    <View
      row
      center
      style={{
        backgroundColor: "#ffc745",
        borderRadius: 4,
        paddingVertical: 5,
      }}
    >
      <Text text75 marginR-10>
        Payment Terminal is not accessible
      </Text>
      <Button
        size="xSmall"
        disabled={ecrLoginQuery.isLoading}
        onPress={() => ecrLoginQuery.mutate()}
        label={
          ecrLoginQuery.isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            "Reconnect"
          )
        }
      />
    </View>
  );
};

export default TerminalConnectionChecker;

const styles = StyleSheet.create({});
