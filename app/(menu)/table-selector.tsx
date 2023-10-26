import React from "react";
import { StyleSheet } from "react-native";
import TableSelectorScreen from "../../modules/menu/components/TableSelectorScreen";
import { useQuery } from "@tanstack/react-query";
import { getTables, tablesQueryKey } from "../../modules/menu/MenuApi";
import { Colors, LoaderScreen } from "react-native-ui-lib";
import { onRequestError } from "../../modules/common/PetitionsHelper";

const TableSelector = () => {
  const tablesQuery = useQuery({
    queryKey: [tablesQueryKey],
    queryFn: getTables,
    onError: (error) => onRequestError(error, "Error loading Tables"),
  });

  if (tablesQuery.isLoading || !tablesQuery.isSuccess)
    return <LoaderScreen message={"Loading Tables"} color={Colors.grey40} />;

  return <TableSelectorScreen tablesAvailable={tablesQuery.data.tables} />;
};

export default TableSelector;

const styles = StyleSheet.create({});
