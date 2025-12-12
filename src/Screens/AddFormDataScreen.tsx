import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Platform,
    Animated,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import {
    TextInput,
    Card,
    Avatar,
    Badge,
    Button,
    ActivityIndicator,
    FAB,
    useTheme,
    Portal,
    Provider as PaperProvider,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch, useAppSelector } from "../hooks";
import { savePendingForm } from "../utils/storage";
import { getNetworkStatus } from "../utils/netInfo";
import { createObject, addLocallyCreated } from "../store/slices";
import { CreateObjectPayload } from "../types";

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

    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let mounted = true;
        getNetworkStatus().then((s) => {
            if (mounted) setOnline(Boolean(s));
        });
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
        }).start();
        return () => {
            mounted = false;
        };
    }, []);

    const setField = (key: keyof FormState, value: string) => {
        let updated = value;
        const newErrors = { ...errors };

        if (key === "name") {
            updated = value.replace(/[^A-Za-z0-9 .\-]/g, "");
            newErrors.name = updated.trim() ? undefined : "Name is required";
        }

        if (key === "year") {
            updated = value.replace(/[^0-9]/g, "");
            if (updated.length > 4) updated = updated.slice(0, 4);
            newErrors.year = updated ? undefined : "Year is required";
        }

        if (key === "price") {
            updated = value.replace(/[^0-9]/g, "");
            newErrors.price = updated ? undefined : "Price is required";
        }

        if (key === "hardDisk") {
            updated = value.replace(/[^0-9]/g, "");
            newErrors.hardDisk = updated ? undefined : "Hard disk is required";
        }

        if (key === "cpu") {
            newErrors.cpu = updated.trim() ? undefined : "CPU model is required";
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

    const pressIn = () =>
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
            stiffness: 200,
            damping: 12,
        }).start();

    const pressOut = () =>
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            stiffness: 200,
            damping: 12,
        }).start();

    const handleSubmit = async () => {
        const valid = validateBeforeSubmit();
        if (!valid) return;

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
                await dispatch(createObject(payload)).unwrap();
                setForm({ name: "", year: "", price: "", cpu: "", hardDisk: "" });
            } catch (e) {
            } finally {
                setSubmitting(false);
            }
        } else {
            const ok = await savePendingForm(form);
            if (ok) {
                dispatch(addLocallyCreated({ ...form, savedAt: new Date().toISOString() } as any));
                setForm({ name: "", year: "", price: "", cpu: "", hardDisk: "" });
            }
            setSubmitting(false);
        }
    };

    const previewEmpty = !form.name && !form.year && !form.price && !form.cpu && !form.hardDisk;

    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.wrapper}>
                <Animated.View style={[styles.headerCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }]}>
                    <View style={styles.headerLeft}>
                        <Avatar.Icon size={54} icon="package" style={{ backgroundColor: "#E8F0FF" }} color="#003A8C" />
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle}>Create New Product</Text>
                            <Text style={styles.headerSubtitle}>Add product information for inventory</Text>
                            <Text style={styles.smallMuted}>{new Date().toLocaleString()}</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <Badge visible={online ?? false} style={[styles.badge, online ? styles.badgeOnline : styles.badgeOffline]}>
                            {online ? "Online" : "Offline"}
                        </Badge>

                    </View>
                </Animated.View>

                <Card style={styles.formCard}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Product details</Text>

                        <TextInput
                            mode="outlined"
                            label="Name *"
                            value={form.name}
                            onChangeText={(t) => setField("name", t)}
                            error={!!errors.name}
                            style={styles.input}
                        />
                        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

                        <View style={styles.row}>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    mode="outlined"
                                    label="Year *"
                                    value={form.year}
                                    onChangeText={(t) => setField("year", t)}
                                    error={!!errors.year}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    style={[styles.input, { marginRight: 8 }]}
                                />
                                {errors.year && <Text style={styles.error}>{errors.year}</Text>}
                            </View>

                            <View style={{ flex: 1 }}>
                                <TextInput
                                    mode="outlined"
                                    label="Price *"
                                    value={form.price}
                                    onChangeText={(t) => setField("price", t)}
                                    error={!!errors.price}
                                    keyboardType="numeric"
                                    left={<TextInput.Icon icon="currency-inr" />}
                                    style={[styles.input, { marginLeft: 8 }]}
                                />
                                {errors.price && <Text style={styles.error}>{errors.price}</Text>}
                            </View>
                        </View>

                        <TextInput
                            mode="outlined"
                            label="CPU Model *"
                            value={form.cpu}
                            onChangeText={(t) => setField("cpu", t)}
                            error={!!errors.cpu}
                            left={<TextInput.Icon icon="chip" />}
                            style={styles.input}
                        />
                        {errors.cpu && <Text style={styles.error}>{errors.cpu}</Text>}

                        <TextInput
                            mode="outlined"
                            label="Hard Disk (GB) *"
                            value={form.hardDisk}
                            onChangeText={(t) => setField("hardDisk", t)}
                            error={!!errors.hardDisk}
                            keyboardType="numeric"
                            left={<TextInput.Icon icon="harddisk" />}
                            style={styles.input}
                        />
                        {errors.hardDisk && <Text style={styles.error}>{errors.hardDisk}</Text>}
                    </Card.Content>
                </Card>

                <Card style={[styles.previewCard, previewEmpty && styles.previewCardDim]}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Live preview</Text>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>Name</Text>
                            <Text style={styles.previewValue}>{form.name || "-"}</Text>
                        </View>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>Year</Text>
                            <Text style={styles.previewValue}>{form.year || "-"}</Text>
                        </View>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>Price</Text>
                            <Text style={styles.previewValue}>{form.price ? `₹ ${form.price}` : "-"}</Text>
                        </View>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>CPU</Text>
                            <Text style={styles.previewValue}>{form.cpu || "-"}</Text>
                        </View>
                        <View style={styles.previewRow}>
                            <Text style={styles.previewLabel}>Hard Disk</Text>
                            <Text style={styles.previewValue}>{form.hardDisk ? `${form.hardDisk} GB` : "-"}</Text>
                        </View>
                    </Card.Content>
                </Card>

                <View style={styles.actions}>
                    {loading || submitting ? (
                        <ActivityIndicator animating size="large" style={{ marginTop: 8 }} />
                    ) : (
                        <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut}>
                            <Animated.View style={[styles.primaryBtn, { transform: [{ scale: scaleAnim }] }]}>
                                <Button
                                    mode="contained"
                                    contentStyle={{ height: 52 }}
                                    labelStyle={{ fontSize: 16, fontWeight: "700" }}
                                    onPress={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Animated.View>
                        </TouchableWithoutFeedback>
                    )}

                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate("GetFormDataScreen", { id: lastCreatedId ?? "" })}
                        style={styles.secondaryBtn}
                        contentStyle={{ height: 50 }}
                        labelStyle={{ fontSize: 15, fontWeight: "600" }}
                    >
                        Fetch Data by ID
                    </Button>
                </View>

                <Text style={styles.lastIdText}>Last Created ID: {String(lastCreatedId ?? "-")}</Text>

            </ScrollView>
        </PaperProvider>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 16,
        paddingBottom: 40,
        backgroundColor: "#F6F9FF",
    },
    headerCard: {
        backgroundColor: "white",
        borderRadius: 14,
        padding: 14,
        marginBottom: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
    },
    headerLeft: { flexDirection: "row", alignItems: "center" },
    headerText: { marginLeft: 12 },
    headerTitle: { fontSize: 18, fontWeight: "700", color: "#002853" },
    headerSubtitle: { fontSize: 13, color: "#576675", marginTop: 2 },
    headerRight: { alignItems: "flex-end" },
    badge: { alignSelf: "flex-end", marginBottom: 6 },
    badgeOnline: { backgroundColor: "#E6F4EA", color: "#116530" },
    badgeOffline: { backgroundColor: "#FFF2F0", color: "#9B2C2C" },
    smallMuted: { fontSize: 11, color: "#7A8797" },
    formCard: {
        borderRadius: 14,
        marginBottom: 14,
        overflow: "hidden",
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#01305A",
        marginBottom: 10,
    },
    input: {
        marginBottom: 6,
        backgroundColor: "white",
    },
    error: { color: "#B92525", fontSize: 12, marginBottom: 6 },
    row: { flexDirection: "row", alignItems: "center" },
    previewCard: {
        borderRadius: 14,
        marginBottom: 18,
        overflow: "hidden",
        elevation: 1,
        backgroundColor: "white",
    },
    previewCardDim: {
        opacity: 0.95,
    },
    previewRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
    previewLabel: { color: "#7A8797", fontSize: 13 },
    previewValue: { fontSize: 14, color: "#14202B", fontWeight: "600" },
    actions: { marginTop: 6 },
    primaryBtn: {
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 12,
        elevation: 3,
        shadowColor: "#003A8C",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
    },
    secondaryBtn: { borderRadius: 12, shadowColor: "#003A8C", borderWidth: 1.2 },
    lastIdText: {
        textAlign: "center",
        marginTop: 14,
        fontSize: 13,
        color: "#344955",
    },
    fab: {
        position: "absolute",
        right: 16,
        bottom: Platform.OS === "ios" ? 24 : 18,
        backgroundColor: "#0066FF",
    },
});
