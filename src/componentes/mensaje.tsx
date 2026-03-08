import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

interface MensajeProps {
    visible: boolean;
    mensaje?: string;
    duracion?: number;       // en ms, default 3000
    onOcultar: () => void;
}

const Mensaje = ({ visible, mensaje = "Mensaje de éxito", duracion = 3000, onOcultar }: MensajeProps) => {

    const progreso = useRef(new Animated.Value(1)).current;
    const opacidad = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!visible) return;

        // Resetear
        progreso.setValue(1);
        opacidad.setValue(0);

        Animated.sequence([
            // Aparecer
            Animated.timing(opacidad, {
                toValue: 1,
                duration: 250,
                useNativeDriver: false,
            }),
            // Barra se vacía
            Animated.timing(progreso, {
                toValue: 0,
                duration: duracion,
                useNativeDriver: false,
            }),
            // Desaparecer
            Animated.timing(opacidad, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }),
        ]).start(() => onOcultar());

    }, [visible]);

    if (!visible) return null;

    const anchoBar = progreso.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <Animated.View style={[styles.contenedor, { opacity: opacidad }]}>
            <Text style={styles.texto}>{mensaje}</Text>
            
            {/* Barra de progreso */}
            <View style={styles.barraFondo}>
                <Animated.View style={[styles.barraRelleno, { width: anchoBar }]} />
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: "#ffffff",
        position: "absolute",
        top: "5%",
        right: 16,
        left: 16,
        padding: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        zIndex: 999,
    },
    texto: {
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
        marginBottom: 10,
    },
    barraFondo: {
        height: 4,
        backgroundColor: "#e5e7eb",
        borderRadius: 99,
        overflow: "hidden",
    },
    barraRelleno: {
        height: "100%",
        backgroundColor: "#22c55e",
        borderRadius: 99,
    },
});

export default Mensaje;