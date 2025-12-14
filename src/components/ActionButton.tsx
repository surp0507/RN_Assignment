import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, ActivityIndicator } from "react-native-paper";

interface Props {
    onSubmit: () => void;
    onFetch: () => void;
    loading?: boolean;
}

const ActionButtons = ({ onSubmit, onFetch, loading }: Props) => (
    <View style={styles.container}>
        {loading ? (
            <ActivityIndicator size="large" style={{ marginVertical: 8 }} />
        ) : (
            <>
                <Button mode="contained" onPress={onSubmit} style={styles.primaryBtn}>
                    Submit
                </Button>
                <Button mode="outlined" onPress={onFetch} style={styles.secondaryBtn}>
                    Fetch Data by ID
                </Button>
            </>
        )}
    </View>
);

export default ActionButtons;

const styles = StyleSheet.create({
    container: { marginTop: 6 },
    primaryBtn: { marginBottom: 12, borderRadius: 12 },
    secondaryBtn: { borderRadius: 12 },
});
