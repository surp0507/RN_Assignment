import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import NetInfo from '@react-native-community/netinfo';
import { createObject, addLocallyCreated } from '../slices/';
import { savePendingForm } from '../utils/storage';
import { isOnline } from '../utils/netInfo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CreateObjectPayload } from '../types';

interface RootState {
    objects: {
        loading: boolean;
        lastCreatedId: string | number | null;
        error: unknown;
    };
}

interface FormState {
    name: string;
    year: string;
    price: string;
    cpu: string;
    hardDisk: string;
}

interface ErrorState {
    name?: string | null;
    year?: string | null;
    price?: string | null;
    cpu?: string | null;
    hardDisk?: string | null;
}

type Props = NativeStackScreenProps<any, any>;

export default function AddFormDataScreen({ navigation }: Props) {
    const dispatch = useAppDispatch();
    const { loading, lastCreatedId, error } = useAppSelector((s: RootState) => s.objects);

    const [id, setIDs] = useState<string>("");

    const [form, setForm] = useState<FormState>({
        name: '',
        year: '',
        price: '',
        cpu: '',
        hardDisk: '',
    });

    const [errors, setErrors] = useState<ErrorState>({});

    const setField = (key: keyof FormState, value: string) => {
        let updated = value;
        const newErrors = { ...errors };

        switch (key) {
            case 'name':
                updated = value.replace(/[^A-Za-z ]/g, '');
                newErrors.name = updated.trim() ? null : "Name is required";
                break;

            case 'year':
                updated = value.replace(/[^0-9]/g, '');
                if (updated.length > 4) updated = updated.slice(0, 4);
                newErrors.year = updated ? null : "Year is required";
                break;

            case 'price':
                updated = value.replace(/[^0-9]/g, '');
                newErrors.price = updated ? null : "Price is required";
                break;

            case 'hardDisk':
                updated = value.replace(/[^0-9]/g, '');
                newErrors.hardDisk = updated ? null : "Hard disk size is required";
                break;

            case 'cpu':
                newErrors.cpu = updated.trim() ? null : "CPU model is required";
                break;
        }

        setForm(prev => ({ ...prev, [key]: updated }));
        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const newErrors: ErrorState = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.year.trim()) newErrors.year = "Year is required";
        if (!form.price.trim()) newErrors.price = "Price is required";
        if (!form.cpu.trim()) newErrors.cpu = "CPU model is required";
        if (!form.hardDisk.trim()) newErrors.hardDisk = "Hard disk size is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        const valid = validateBeforeSubmit();
        if (!valid) {
            Alert.alert("Validation Error", "Please fill all required fields.");
            return;
        }
        const online = await isOnline();
        if (online) {
            const payload: CreateObjectPayload = {
                name: form.name,
                data: {
                    year: Number(form.year),
                    price: Number(form.price),
                    cpu: form.cpu,
                    hardDisk: Number(form.hardDisk),
                }
            };

            dispatch(createObject(payload)).unwrap()
                .then((res: any) => {
                    Alert.alert("Success", `Created object with ID: ${res.id}`);
                    setIDs(String(res.id));
                    navigation.navigate('GetFormDataScreen', { id: res.id });
                })
                .catch((err: any) => {
                    const msg = err?.message?.message || err?.message || "Unknown error";
                    Alert.alert("API Error", msg);
                });

        } else {
            const ok = await savePendingForm(form);
            if (ok) {
                dispatch(addLocallyCreated({ ...form, savedAt: new Date().toISOString() }) as any);
                Alert.alert("Offline", "Data saved locally you are in offline mode.");
            } else {
                Alert.alert("Storage Error", "Failed to save locally.");
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <TextInput
                mode="outlined"
                label="Name *"
                value={form.name}
                onChangeText={(t) => setField('name', t)}
                error={!!errors.name}
                style={styles.input}
            />
            {errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput
                mode="outlined"
                label="Year *"
                maxLength={4}
                keyboardType="numeric"
                value={form.year}
                onChangeText={(t) => setField('year', t)}
                error={!!errors.year}
                style={styles.input}
            />
            {errors.year && <Text style={styles.error}>{errors.year}</Text>}

            <TextInput
                mode="outlined"
                label="Price *"
                keyboardType="numeric"
                value={form.price}
                onChangeText={(t) => setField('price', t)}
                error={!!errors.price}
                style={styles.input}
            />
            {errors.price && <Text style={styles.error}>{errors.price}</Text>}

            <TextInput
                mode="outlined"
                label="CPU Model *"
                value={form.cpu}
                onChangeText={(t) => setField('cpu', t)}
                error={!!errors.cpu}
                style={styles.input}
            />
            {errors.cpu && <Text style={styles.error}>{errors.cpu}</Text>}

            <TextInput
                mode="outlined"
                label="Hard Disk (GB) *"
                keyboardType="numeric"
                value={form.hardDisk}
                onChangeText={(t) => setField('hardDisk', t)}
                error={!!errors.hardDisk}
                style={styles.input}
            />
            {errors.hardDisk && <Text style={styles.error}>{errors.hardDisk}</Text>}

            {loading ? (
                <ActivityIndicator />
            ) : (
                <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("GetFormDataScreen", { id })}
            >
                <Text style={styles.btnText}>Fetch Data By ID</Text>
            </TouchableOpacity>

            {Boolean(error) && (
                <Text style={{ color: "red" }}>{String(error)}</Text>
            )}

            {lastCreatedId && <Text style={{ marginTop: 10 }}>Last Created ID: {lastCreatedId}</Text>}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: { padding: 16 },
    input: { marginTop: 12 },
    error: { color: 'red', fontSize: 12, marginTop: 2 },
    btn: {
        marginTop: 20,
        padding: 14,
        backgroundColor: "blue",
        borderRadius: 10,
        alignItems: "center"
    },
    btnText: {
        color: "white",
        fontWeight: "700",
        fontSize: 16
    }
});
