import { StyleSheet, Text, View } from "react-native";
import React from "react";
import JournalScreen from "../../modules/payment/components/JournalScreen";
import { useQuery } from "@tanstack/react-query";
import {
  ecrJournalQueryKey,
  getEcrJournal,
} from "../../modules/payment/PaymentApi";
import {
  handlePetitionError,
  showAlert,
} from "../../modules/common/AlertHelper";
import { Colors, LoaderScreen } from "react-native-ui-lib";

const journal = () => {
  const ecrJournalQuery = useQuery({
    queryKey: [ecrJournalQueryKey],
    queryFn: getEcrJournal,
    onError: (error: any) => {
      if (error?.response_message == "NO TRANSACTIONS.") {
        showAlert({ type: "warning", title: "NO TRANSACTIONS" });
        return;
      }

      handlePetitionError(error, "Error loading Journal");
    },
    refetchInterval: 70000,
  });

  if (ecrJournalQuery.isLoading || !ecrJournalQuery.isSuccess)
    return <LoaderScreen message={"Loading Journal"} color={Colors.grey40} />;

  return <JournalScreen ecrJournal={ecrJournalQuery.data} />;
};

export default journal;

const styles = StyleSheet.create({});
