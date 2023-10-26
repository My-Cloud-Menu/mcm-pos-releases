import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTimesSheet, timesSheetQueryKey } from "../../modules/auth/AuthApi";
import { onRequestError } from "../../modules/common/PetitionsHelper";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import ClocksInOutScreen from "../../modules/auth/components/ClocksInOutScreen";

const ClocksInOut = () => {
  const timesSheetQuery = useQuery({
    queryKey: [timesSheetQueryKey],
    queryFn: getTimesSheet,
    onError: (error) => onRequestError(error, "Error loading Employees Data"),
  });

  if (timesSheetQuery.isLoading || !timesSheetQuery.isSuccess)
    return <LoaderScreen message={"Loading Employees"} color={Colors.grey40} />;

  return <ClocksInOutScreen timesSheet={timesSheetQuery.data} />;
};

export default ClocksInOut;

const styles = StyleSheet.create({});
