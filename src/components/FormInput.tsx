import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

interface Props {
    label: string;
    value: string;
    onChange: (text: string) => void;
    error?: string;
    keyboardType?: "default" | "numeric";
    icon?: string;
}

const FormInput = ({ label, value, onChange, error, keyboardType = "default", icon }: Props) => (
    <View style={styles.wrapper}>
        <TextInput
            mode="outlined"
            label={label}
            value={value}
            onChangeText={onChange}
            error={!!error}
            keyboardType={keyboardType}
            left={icon ? <TextInput.Icon icon={icon} /> : undefined}
            style={styles.input}
        />
        {error && <Text style={styles.error}>{error}</Text>}
    </View>
);

export default FormInput;

const styles = StyleSheet.create({
    wrapper: { marginBottom: 10 },
    input: { backgroundColor: "white" },
    error: { color: "#B92525", fontSize: 12, marginTop: 2 },
});
