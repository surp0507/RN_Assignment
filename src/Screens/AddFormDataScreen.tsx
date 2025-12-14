import React, { useEffect, useRef, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Animated, Alert } from "react-native";
import { Avatar, Badge, useTheme, Provider as PaperProvider } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../hooks";
import { savePendingForm } from "../utils/storage";
import { getNetworkStatus, subscribeNetwork } from "../utils/netInfo";
import { createObject, addLocallyCreated } from "../store/slices";
import { CreateObjectPayload } from "../types";

import FormCard from "../components/FormCard";
import FormInput from "../components/FormInput";
import LivePreview from "../components/LivePreview";
import ActionButtons from "../components/ActionButton";

type Props = NativeStackScreenProps<any, any>;

interface FormState {
    name: string;
    year: string;
    price: string;
    cpu: string;
    hardDisk: string;
}

export default function AddFormDataScreen({ navigation }: Props) {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const { loading, lastCreatedId } = useAppSelector((s: any) => s.objects ?? {});

    const [form, setForm] = useState<FormState>({
        name: "",
        year: "",
        price: "",
        cpu: "",
        hardDisk: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [online, setOnline] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let mounted = true;
        getNetworkStatus().then((s) => mounted && setOnline(Boolean(s)));

        const unsub = subscribeNetwork((status) => {
            setOnline(status);

        });

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
        }).start();

        return () => {
            mounted = false;
            unsub();
        };
    }, []);


    const setField = (key: keyof FormState, value: string) => {
        const newErrors = { ...errors };
        let updated = value;

        switch (key) {
            case "name":
                updated = value.replace(/[^A-Za-z0-9 .\-]/g, "");
                newErrors.name = updated.trim() ? undefined : "Name is required";
                break;
            case "year":
                updated = value.replace(/[^0-9]/g, "").slice(0, 4);
                newErrors.year = updated ? undefined : "Year is required";
                break;
            case "price":
                updated = value.replace(/[^0-9]/g, "");
                newErrors.price = updated ? undefined : "Price is required";
                break;
            case "cpu":
                newErrors.cpu = updated.trim() ? undefined : "CPU model is required";
                break;
            case "hardDisk":
                updated = value.replace(/[^0-9]/g, "");
                newErrors.hardDisk = updated ? undefined : "Hard disk is required";
                break;
        }

        setForm((p) => ({ ...p, [key]: updated }));
        setErrors(newErrors);
    };

    const validateBeforeSubmit = () => {
        const newErrors: Partial<Record<keyof FormState, string>> = {};
        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.year.trim()) newErrors.year = "Year is required";
        if (!form.price.trim()) newErrors.price = "Price is required";
        if (!form.cpu.trim()) newErrors.cpu = "CPU is required";
        if (!form.hardDisk.trim()) newErrors.hardDisk = "Hard disk is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateBeforeSubmit()) return;

        setSubmitting(true);
        const net = await getNetworkStatus();
        setOnline(Boolean(net));

        if (net) {
            const payload: CreateObjectPayload = {
                name: form.name,
                data: {
                    year: Number(form.year),
                    price: Number(form.price),
                    cpu: form.cpu,
                    hardDisk: Number(form.hardDisk),
                },
            };
            try {
                const res = await dispatch(createObject(payload)).unwrap();
                Alert.alert("Success", `Saved successfully.\nID: ${res?.id}`);
                navigation.navigate("GetFormDataScreen", { id: res.id ?? "" });
                setForm({ name: "", year: "", price: "", cpu: "", hardDisk: "" });
            } catch (e: any) {
                Alert.alert("Error", e?.message || "Something went wrong");
            } finally {
                setSubmitting(false);
            }
        } else {
            Alert.alert("Offline Mode", "No internet. Saving data offline…");
            const ok = await savePendingForm(form);
            if (ok) {
                dispatch(addLocallyCreated({ ...form, savedAt: new Date().toISOString() } as any));
                Alert.alert("Saved Offline", "Your data will sync when online.");
                setForm({ name: "", year: "", price: "", cpu: "", hardDisk: "" });
            } else {
                Alert.alert("Error", "Could not save offline data.");
            }
            setSubmitting(false);
        }
    };

    const previewEmpty = !form.name && !form.year && !form.price && !form.cpu && !form.hardDisk;

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Animated.View
                    style={[
                        styles.headerCard,
                        { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] },
                    ]}
                >
                    <View style={styles.headerLeft}>
                        <Avatar.Icon size={54} icon="package" style={{ backgroundColor: "#E8F0FF" }} color="#003A8C" />
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Create New Product</Text>
                            <Text style={styles.headerSubtitle}>Add product information for inventory</Text>
                            <Text style={styles.smallMuted}>{new Date().toLocaleString()}</Text>
                        </View>
                    </View>
                </Animated.View>

                <FormCard>
                    <FormInput label="Name *" value={form.name} onChange={(t) => setField("name", t)} error={errors.name} />
                    <View style={styles.row}>
                        <View style={styles.half}>
                            <FormInput
                                label="Year *"
                                value={form.year}
                                onChange={(t) => setField("year", t)}
                                error={errors.year}
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.half}>
                            <FormInput
                                label="Price *"
                                value={form.price}
                                onChange={(t) => setField("price", t)}
                                error={errors.price}
                                keyboardType="numeric"
                                icon="currency-inr"
                            />
                        </View>
                    </View>
                    <FormInput label="CPU Model *" value={form.cpu} onChange={(t) => setField("cpu", t)} error={errors.cpu} icon="chip" />
                    <FormInput label="Hard Disk (GB) *" value={form.hardDisk} onChange={(t) => setField("hardDisk", t)} error={errors.hardDisk} keyboardType="numeric" icon="harddisk" />
                </FormCard>

                <LivePreview data={form} />

                <ActionButtons
                    onSubmit={handleSubmit}
                    onFetch={() => navigation.navigate("GetFormDataScreen", { id: lastCreatedId ?? "" })}
                    loading={loading || submitting}
                />

                <Text style={styles.lastIdText}>Last Created ID: {String(lastCreatedId ?? "-")}</Text>
            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    wrapper: { padding: 16, paddingBottom: 40, backgroundColor: "#F6F9FF" },
    headerCard: { backgroundColor: "white", borderRadius: 14, padding: 14, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    headerText: { marginLeft: 12 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#002853" },
    headerSubtitle: { fontSize: 13, color: "#576675", marginTop: 2 },
    badge: { alignSelf: "flex-end", marginBottom: 6 },
    badgeOnline: { backgroundColor: "#E6F4EA", color: "#116530" },
    badgeOffline: { backgroundColor: "#FFF2F0", color: "#9B2C2C" },
    row: {
        flexDirection: "row",
        gap: 12,
    },

    half: {
        flex: 1,
    },
    smallMuted: { fontSize: 11, color: "#7A8797" },
    lastIdText: { textAlign: "center", marginTop: 14, fontSize: 13, color: "#344955" },
});
