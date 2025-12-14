import React, { useRef } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";
import { Button } from "react-native-paper";

interface Props {
    label: string;
    loading?: boolean;
    onPress: () => void;
}

export default function AnimatedButton({ label, loading, onPress }: Props) {
    const scale = useRef(new Animated.Value(1)).current;

    const pressIn = () =>
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();

    const pressOut = () =>
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();

    return (
        <TouchableWithoutFeedback onPressIn={pressIn} onPressOut={pressOut}>
            <Animated.View style={{ transform: [{ scale }] }}>
                <Button
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    contentStyle={{ height: 52 }}
                    labelStyle={{ fontSize: 16, fontWeight: "700" }}
                    onPress={onPress}
                >
                    {label}
                </Button>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}
