import React from "react";
import { Text, StyleSheet } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { ProductData } from "../types";


interface Props {
    item: ProductData;
}

export default function ResultCard({ item }: Props) {
    return (
        <Card style={styles.card}>
            <Card.Title
                title={item.name}
                left={(props) => (
                    <Avatar.Icon
                        {...props}
                        icon="package-variant-closed"
                        style={{ backgroundColor: "#E8F0FF" }}
                        color="#003A8C"
                    />
                )}
            />
            <Card.Content>
                <Text>Year: {item.data.year}</Text>
                <Text>Price: ₹ {item.data.price}</Text>
                <Text>CPU: {item.data.cpu}</Text>
                <Text>Hard Disk: {item.data.hardDisk} GB</Text>
            </Card.Content>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        elevation: 2,
    },
});
