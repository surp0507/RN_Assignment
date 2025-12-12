import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from "../hooks";
import { savePendingForm } from '../utils/storage';
import { getNetworkStatus } from "../utils/netInfo";
import { createObject, addLocallyCreated } from '../store/slices';
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

        const online = await getNetworkStatus();
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
                Alert.alert("Offline", "Data saved locally.");
            } else {
                Alert.alert("Storage Error", "Failed to save locally.");
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.wrapper}>
            <Text style={styles.title}>Add New Product</Text>
            <Text style={styles.subtitle}>Fill all required fields to continue</Text>

            <View style={styles.card}>
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
            </View>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
                    <Text style={styles.primaryBtnText}>Submit</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("GetFormDataScreen", { id })}
            >
                <Text style={styles.secondaryBtnText}>Fetch Data by ID</Text>
            </TouchableOpacity>

            {lastCreatedId && <Text style={styles.lastId}>Last Created ID: {lastCreatedId}</Text>}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: { padding: 20, paddingBottom: 40, backgroundColor: "#F5F7FA" },
    title: { fontSize: 26, fontWeight: "700", color: "#001A4D", marginBottom: 4 },
    subtitle: { fontSize: 14, color: "#5A6C8A", marginBottom: 18 },
    card: {
        backgroundColor: "white",
        padding: 18,
        borderRadius: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }
    },
    input: { marginTop: 14 },
    error: { color: "red", fontSize: 12, marginTop: 2 },
    primaryBtn: {
        marginTop: 24,
        backgroundColor: "#0066FF",
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: "center",
        elevation: 3
    },
    primaryBtnText: {
        color: "white",
        fontSize: 17,
        fontWeight: "700"
    },
    secondaryBtn: {
        marginTop: 16,
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 1.4,
        borderColor: "#0066FF",
        alignItems: "center"
    },
    secondaryBtnText: {
        color: "#0066FF",
        fontSize: 16,
        fontWeight: "600"
    },
    lastId: {
        textAlign: "center",
        marginTop: 18,
        fontSize: 14,
        color: "#37475A"
    }
});
