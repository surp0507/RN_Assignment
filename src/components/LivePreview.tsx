import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { FormState } from "../types";

interface Props {
    data: FormState;
}

const LivePreview = ({ data }: Props) => {
    const preview = [
        { label: "Name", value: data.name },
        { label: "Year", value: data.year },
        { label: "Price", value: data.price ? `₹ ${data.price}` : "" },
        { label: "CPU", value: data.cpu },
        { label: "Hard Disk", value: data.hardDisk ? `${data.hardDisk} GB` : "" },
    ];

    return (
        <Card style={styles.card}>
            <Card.Content>
                {preview.map((item) => (
                    <View style={styles.row} key={item.label}>
                        <Text style={styles.label}>{item.label}</Text>
                        <Text style={styles.value}>{item.value || "-"}</Text>
                    </View>
                ))}
            </Card.Content>
        </Card>
    );
};

export default LivePreview;

const styles = StyleSheet.create({
    card: { borderRadius: 14, marginBottom: 18, backgroundColor: "white" },
    row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    label: { color: "#7A8797", fontSize: 13 },
    value: { fontSize: 14, color: "#14202B", fontWeight: "600" },
});
