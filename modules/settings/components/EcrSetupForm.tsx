import { ScrollView, StyleSheet } from "react-native";
import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Colors,
  Text,
  TextField,
  View,
} from "react-native-ui-lib";
import { shadowProps } from "../../common/theme/shadows";
import useEcrStore from "../../ecr/EcrStore";
import { showAlert } from "../../common/AlertHelper";
import TerminalConnectionChecker from "../../auth/components/TerminalConnectionChecker";

export const textFieldCustomProps = {
  labelStyle: { fontWeight: "bold", color: "#424242" },
  placeholderTextColor: Colors.gray,
  style: {
    minWidth: 420,
    padding: 9,
    borderRadius: 6,
    fontSize: 19,
    color: "#000",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
};

const EcrSetupForm = () => {
  const { setup, saveSetup } = useEcrStore((state) => state);

  const [newValues, setNewValues] = useState(setup);

  const onSaveChanges = () => {
    saveSetup(newValues);
    showAlert({
      type: "success",
      title: "Configuracion actualizada exitosamente!",
    });
  };

  return (
    <View style={{ backgroundColor: "#fff", paddingBottom: 30 }}>
      <TerminalConnectionChecker buttonLabel="Test Connection" />
      <View centerH row style={{ flexWrap: "wrap", gap: 30 }}>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, terminal_id: value })
              }
              value={newValues.terminal_id}
              label="TERMINAL ID"
              placeholder="TERMINAL ID"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, station_number: value })
              }
              value={newValues.station_number}
              label="Station Number"
              placeholder="Station Number"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, cashier_id: value })
              }
              value={newValues.cashier_id}
              label="Cashier ID"
              placeholder="Cashier ID"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              keyboardType="number-pad"
              onChangeText={(value) =>
                setNewValues({ ...newValues, reference: value })
              }
              value={newValues.reference.toString()}
              label="Reference"
              placeholder="Reference"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, batch_number: value })
              }
              value={newValues.batch_number?.toString()}
              label="Batch Number"
              placeholder="Batch Number"
              {...textFieldCustomProps}
            />
          </View>
        </View>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, ip: value })
              }
              value={newValues.ip}
              label="IP"
              placeholder="IP"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, port: value })
              }
              value={newValues.port}
              label="PORT"
              placeholder="PORT"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, api_key: value })
              }
              value={newValues.api_key}
              label="API KEY"
              placeholder="API KEY"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, last_reference: value })
              }
              value={newValues.last_reference?.toString()}
              label="Last Reference"
              placeholder="Last Reference"
              {...textFieldCustomProps}
            />
          </View>
        </View>
      </View>
      <Text marginT-30 text50 center>
        Preferencias
      </Text>
      <View centerH row style={{ flexWrap: "wrap", gap: 30 }}>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <Checkbox
              value={newValues.receipt_email == "yes"}
              onValueChange={(value) =>
                setNewValues({
                  ...newValues,
                  receipt_email: value ? "yes" : "no",
                })
              }
              color={Colors.primary}
              label="Receipt Email"
            />
          </View>

          <View style={styles.inputContainer}>
            <Checkbox
              value={newValues.manual_entry_indicator == "yes"}
              onValueChange={(value) =>
                setNewValues({
                  ...newValues,
                  manual_entry_indicator: value ? "yes" : "no",
                })
              }
              color={Colors.primary}
              label="Manual Entry Indicator"
            />
          </View>
        </View>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <Checkbox
              value={newValues.force_duplicate == "yes"}
              onValueChange={(value) =>
                setNewValues({
                  ...newValues,
                  force_duplicate: value ? "yes" : "no",
                })
              }
              color={Colors.primary}
              label="Force Duplicate"
            />
          </View>
          <View style={styles.inputContainer}>
            <Checkbox
              value={newValues.process_cashback == "yes"}
              onValueChange={(value) =>
                setNewValues({
                  ...newValues,
                  process_cashback: value ? "yes" : "no",
                })
              }
              color={Colors.primary}
              label="Process Cashback"
            />
          </View>
        </View>
      </View>
      <Button
        onPress={onSaveChanges}
        marginV-30
        marginH-40
        label="Guardar Cambios"
      />
    </View>
  );
};

export default EcrSetupForm;

const styles = StyleSheet.create({
  inputContainer: {
    maxWidth: 500,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    ...shadowProps,
  },
});
