import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, Button, ToastAndroid } from 'react-native';
import { View, TextInput, StyleSheet, Text, SafeAreaView } from 'react-native';
import axios from '../modules/common/axios';
import { makeMcmRequest } from '../modules/common/PetitionsHelper';
import useEcrStore from '../modules/ecr/EcrStore';
import { useNavigation } from 'expo-router';
import useGlobalStore from '../modules/common/GlobalStore';

export const getECRSetup = (response: any) => {
    const { verifoneSetup } = response;
    // verifoneSetup.last_reference = parseInt(f.last_reference);
    verifoneSetup.batch_number = undefined;
    return verifoneSetup;
}

export const getGlobalSetup = (response: any) => {
    const { setup } = response;
    // verifoneSetup.last_reference = parseInt(f.last_reference);
    setup.id = response.id;
    setup.siteId = response.site_id;
    return setup;
}

const RequestInitialCode = () => {
    const navigation: any = useNavigation();
    const [code, setCode] = useState('');
    const { saveSetup: setECRSetup, setFirstSetup } = useEcrStore();
    const { saveSetup: setGlobalSetup } = useGlobalStore();

    async function setSetup() {
        try {

            const f = await makeMcmRequest(`admin/devices-configuration/${code}`);
            const scrSetup = getECRSetup(f);
            const globalSetup = getGlobalSetup(f);
            setECRSetup(scrSetup);
            setGlobalSetup(globalSetup);
            setFirstSetup(false);
            console.log({ scrSetup });
            navigation.navigate("(menu)", { screen: "menu" });

        } catch (error) {
            Alert.alert('No device configuration found for this code');
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Enter Code:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your code"
                    value={code}
                    onChangeText={setCode}
                    keyboardType="numeric"
                />
                <View style={styles.button}>
                    <Button title='Register' onPress={setSetup} />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    inputContainer: {
        width: '80%',
        paddingHorizontal: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    button: {
        marginTop: 20
    }
});

export default RequestInitialCode;