import React from "react";
import { TextInput, Card } from "react-native-paper";

interface Props {
    value: string;
    onChange: (v: string) => void;
}

export default function SearchBox({ value, onChange }: Props) {
    return (
        <Card style={{ borderRadius: 14, marginBottom: 18 }}>
            <Card.Content>
                <TextInput
                    mode="outlined"
                    label="Enter IDs"
                    value={value}
                    onChangeText={onChange}
                />
            </Card.Content>
        </Card>
    );
}
