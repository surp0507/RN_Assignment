import React, { useEffect, useState } from "react";
import { View, Text, Alert, FlatList, StyleSheet } from "react-native";
import { Avatar, Divider } from "react-native-paper";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks";
import { getObjectsByIds, setFetchedFromStorage } from "../store/slices";
import { saveLastFetched, getLastFetched } from "../utils/storage";
import { getNetworkStatus } from "../utils/netInfo";
import SearchBox from "../components/SearchBox";
import ResultCard from "../components/ResultCard";
import AnimatedButton from "../components/AnimatedButton";
import { ProductData } from "../types";

type RouteParams = {
    GetFormDataScreen: { id: string };
};

export default function GetFormDataScreen() {
    const dispatch = useAppDispatch();
    const route = useRoute<RouteProp<RouteParams, "GetFormDataScreen">>();
    const { fetched, loading } = useAppSelector((s) => s.objects);

    const [ids, setIds] = useState(route.params?.id || "");

    useEffect(() => {
        getLastFetched().then((d) => d && dispatch(setFetchedFromStorage(d)));
    }, [dispatch]);

    const onChangeIds = (value: string) => {
        setIds(
            value
                .replace(/\s+/g, "")
                .replace(/[^A-Za-z0-9,]/g, "")
                .replace(/,{2,}/g, ",")
        );
    };

    const handleFetch = async () => {
        if (!ids) return Alert.alert("Enter valid IDs");

        const online = await getNetworkStatus();
        if (!online) {
            Alert.alert("Offline", "Showing cached data");
            return;
        }

        dispatch(getObjectsByIds(ids))
            .unwrap()
            .then(saveLastFetched)
            .catch(() => Alert.alert("Error fetching data"));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Avatar.Icon icon="magnify" size={50} style={styles.icon} />
                <Text style={styles.title}>Search Product</Text>
            </View>

            <SearchBox value={ids} onChange={onChangeIds} />
            <AnimatedButton label="Search" loading={loading} onPress={handleFetch} />

            <Text style={styles.result}>Results</Text>
            <Divider />

            <FlatList<ProductData>
                data={fetched}
                keyExtractor={(i) => i.id}
                renderItem={({ item }) => <ResultCard item={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 18, backgroundColor: "#F5F7FA" },
    header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
    icon: { backgroundColor: "#E8F0FF", marginRight: 12 },
    title: { fontSize: 20, fontWeight: "700", color: "#003A8C" },
    result: { fontSize: 18, fontWeight: "700", marginVertical: 10 },
});
