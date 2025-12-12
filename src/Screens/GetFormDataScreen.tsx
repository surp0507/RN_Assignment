import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert,
    ActivityIndicator,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { TextInput } from 'react-native-paper';
import { useRoute, RouteProp } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    getObjectsByIds,
    setFetchedFromStorage,
} from "../slices";
import { saveLastFetched, getLastFetched } from "../utils/storage";
import { isOnline } from "../utils/netInfo";

type RootStackParamList = {
    GetFormDataScreen: { id: string };
};

type ScreenRoute = RouteProp<RootStackParamList, "GetFormDataScreen">;

export default function GetFormDataScreen() {
    const dispatch = useAppDispatch();
    const route = useRoute<ScreenRoute>();

    const { fetched, loading, error } = useAppSelector((s) => s.objects);

    const [ids, setIds] = useState<string>(route.params?.id || "");

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

        const online = await isOnline();

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

    return (
        <View style={styles.container}>
            <TextInput

                mode="outlined"
                label={"Search ID"}
                value={ids}
                onChangeText={onChangeIds}
                keyboardType="default"  // <-- now full keyboard
            />

            {loading ? (
                <ActivityIndicator />
            ) : (
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleFetch}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            )}

            {error && <Text style={styles.error}>{JSON.stringify(error)}</Text>}

            <Text style={styles.resultTitle}>Results:</Text>

            <FlatList
                data={fetched}
                keyExtractor={(item, index) =>
                    String(item?.id || index)
                }
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>
                            {item.name || `ID: ${item.id}`}
                        </Text>
                        <Text>Year: {item?.data?.year ?? "N/A"}</Text>
                        <Text>Price: {item?.data?.price ?? "N/A"}</Text>
                        <Text>CPU: {item?.data?.cpu ?? "N/A"}</Text>
                        <Text>
                            Hard Disk: {item?.data?.hardDisk ?? "N/A"}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 16, flex: 1 },
    label: { fontWeight: "600", marginBottom: 6 },
    outlinedInput: {
        borderWidth: 2,
        borderColor: "#4A90E2",
        padding: 12,
        borderRadius: 10,
        fontSize: 16,
        backgroundColor: "#fff",
        marginBottom: 14,
    },
    button: {
        backgroundColor: "blue",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 12,
        marginBottom: 12,
    },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
    error: { color: "red", marginTop: 10 },
    resultTitle: { marginTop: 16, fontWeight: "700", fontSize: 16 },
    item: {
        padding: 12,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 10,
        backgroundColor: "#fafafa",
    },
    itemTitle: { fontWeight: "700", marginBottom: 4 },
});
