import React from "react";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

interface Props {
    children: React.ReactNode;
}

const FormCard = ({ children }: Props) => (
    <Card style={styles.card}>
        <Card.Content>{children}</Card.Content>
    </Card>
);

export default FormCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 14,
        marginBottom: 14,
        overflow: "hidden",
        elevation: 2,
        backgroundColor: "white",
    },
});
