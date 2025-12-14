import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
} from "react-native";
import { TextInput, Card, Avatar, Divider, Button } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
    getObjectsByIds,
    setFetchedFromStorage,
} from "../store/slices";
import { saveLastFetched, getLastFetched } from "../utils/storage";
import { getNetworkStatus } from "../utils/netInfo";


type RootStackParamList = {
    GetFormDataScreen: { id: string };
};

type ScreenRoute = RouteProp<RootStackParamList, "GetFormDataScreen">;

export default function GetFormDataScreen() {
    const dispatch = useAppDispatch();
    const route = useRoute<ScreenRoute>();
    const { fetched, loading, error } = useAppSelector((s) => s.objects);
    const [ids, setIds] = useState<string>(route.params?.id || "");
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            const last = await getLastFetched();
            if (last && last.length) dispatch(setFetchedFromStorage(last));
        })();
    }, [dispatch]);

    const onChangeIds = (value: string) => {
        let cleaned = value
            .replace(/\s+/g, "")
            .replace(/[^A-Za-z0-9,]/g, "");
        cleaned = cleaned.replace(/,{2,}/g, ",");
        if (cleaned.startsWith(",")) cleaned = cleaned.slice(1);
        setIds(cleaned);
    };

    const handleFetch = async () => {
        if (!ids.trim()) {
            Alert.alert("Input required", "Please enter valid IDs.");
            return;
        }

        const valid = /^[A-Za-z0-9,]+$/.test(ids);
        if (!valid) {
            Alert.alert("Invalid Input", "Only alphanumeric characters and commas are allowed.");
            return;
        }

        const online = await getNetworkStatus();

        if (online) {
            dispatch(getObjectsByIds(ids))
                .unwrap()
                .then(async (res) => {
                    await saveLastFetched(res);
                })
                .catch((err: any) => {
                    const msg =
                        err?.message?.message ||
                        err?.message ||
                        "Unknown error";
                    Alert.alert("API Error", msg);
                });
        } else {
            Alert.alert("Offline Mode", "Showing last saved data.");
            const last = await getLastFetched();
            if (last && last.length) dispatch(setFetchedFromStorage(last));
        }
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
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar.Icon size={52} icon="magnify" style={styles.headerIcon} color="#003A8C" />
                <Text style={styles.headerTitle}>Search Product Details</Text>
            </View>

            <Card style={styles.card}>
                <Card.Content>
                    <TextInput
                        mode="outlined"
                        label="Enter IDs"
                        value={ids}
                        onChangeText={onChangeIds}
                        keyboardType="default"

                        style={styles.input}
                    />

                    {loading ? (
                        <ActivityIndicator style={{ marginTop: 12 }} />
                    ) : (
                        <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut}>
                            <Animated.View style={[styles.primaryBtn, { transform: [{ scale: scaleAnim }] }]}>
                                <Button
                                    mode="contained"
                                    contentStyle={{ height: 52 }}
                                    labelStyle={{ fontSize: 16, fontWeight: "700" }}
                                    onPress={handleFetch}
                                >
                                    Search
                                </Button>
                            </Animated.View>
                        </TouchableWithoutFeedback>

                    )}
                    {error ? <Text style={styles.error}>{JSON.stringify(error)}</Text> : null}
                </Card.Content>
            </Card>

            <Text style={styles.resultTitle}>Results</Text>
            <Divider style={{ marginBottom: 10 }} />

            <FlatList
                data={fetched}
                keyExtractor={(item, index) => String(item?.id || index)}
                renderItem={({ item }) => (
                    <Card style={styles.itemCard}>
                        <Card.Title
                            title={item.name || `ID: ${item.id}`}
                            left={(props) => (
                                <Avatar.Icon
                                    {...props}
                                    icon="package-variant-closed"
                                    color="#003A8C"
                                    style={{ backgroundColor: "#E8F0FF" }}
                                />
                            )}
                        />
                        <Card.Content>
                            <Text style={styles.itemText}>Year: {item?.data?.year ?? "N/A"}</Text>
                            <Text style={styles.itemText}>Price: {item?.data?.price ?? "N/A"}</Text>
                            <Text style={styles.itemText}>CPU: {item?.data?.cpu ?? "N/A"}</Text>
                            <Text style={styles.itemText}>Hard Disk: {item?.data?.hardDisk ?? "N/A"}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 18, flex: 1, backgroundColor: "#F5F7FA" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    headerIcon: { backgroundColor: "#E8F0FF", marginRight: 12 },
    headerTitle: { fontSize: 20, fontWeight: "700", color: "#003A8C" },

    card: {
        borderRadius: 14,
        paddingVertical: 6,
        marginBottom: 18,
        backgroundColor: "#FFFFFF",
        elevation: 2,
    },

    input: { backgroundColor: "#fff", marginBottom: 12 },

    button: {
        backgroundColor: "#003A8C",
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
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
    error: { color: "red", marginTop: 10 },

    resultTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#003A8C",
        marginTop: 10,
    },

    itemCard: {
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: "#FFFFFF",
        elevation: 2,
        paddingVertical: 4,
    },
    itemText: { fontSize: 14, marginBottom: 2, color: "#333" },
});
