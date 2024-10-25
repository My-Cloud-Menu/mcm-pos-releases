import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
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
import useGlobalStore from "../../common/GlobalStore";

const textFieldCustomProps = {
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

const GeneralSetupForm = () => {
  const { setup, saveSetup } = useGlobalStore((state) => state);

  const [newValues, setNewValues] = useState(setup);
  console.log({ newValues });
  useEffect(() => {
    if (setup) {
      setNewValues(setup);
    }
  }, [setup]);

  const onSaveChanges = () => {
    saveSetup(newValues);
    showAlert({
      type: "success",
      title: "Configuracion actualizada exitosamente!",
    });
  };

  return (
    <View style={{ backgroundColor: "#fff", paddingBottom: 20 }}>
      <View centerH row style={{ flexWrap: "wrap", gap: 30 }}>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, id: value })
              }
              value={newValues.id}
              label="Device ID"
              placeholder="Device ID"
              {...textFieldCustomProps}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, siteId: value })
              }
              value={newValues.siteId}
              label="Site ID"
              placeholder="Site ID"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, locationId: value })
              }
              value={newValues.locationId}
              label="Location ID"
              placeholder="Location ID"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, url: value })
              }
              value={newValues.url}
              label="Url"
              placeholder="Url"
              {...textFieldCustomProps}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, apiKey: value })
              }
              value={newValues.apiKey}
              label="API KEY"
              placeholder="API KEY"
              {...textFieldCustomProps}
              multiline
            />
          </View>
        </View>
        <View paddingH-20 paddingV-20 style={{ gap: 20 }}>
          <View style={styles.inputContainer}>
            <TextField
              onChangeText={(value) =>
                setNewValues({ ...newValues, password_length: value })
              }
              value={newValues.password_length.toString()}
              label="Password Length"
              placeholder="Password Length"
              {...textFieldCustomProps}
            />
          </View>
          <View style={styles.inputContainer}>
            <Checkbox
              value={newValues.showErrors}
              onValueChange={(value) =>
                setNewValues({
                  ...newValues,
                  showErrors: value,
                })
              }
              color={Colors.primary}
              label="Debug Mode"
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

export default GeneralSetupForm;

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
