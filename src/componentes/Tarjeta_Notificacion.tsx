import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const Tarjeta_Notificacion = () => {
    return(
        <View style={styles.card}>
            
            <View style={styles.contenido}>
                <Text style={styles.texto}>
                    <Text style={styles.usuario}>Usuario_1 </Text>
                    le ha dado like a tu plato
                </Text>

                <TouchableOpacity style={styles.botonCerrar}>
                    <Text style={styles.iconoCerrar}>✖</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: "#1E1E1E",
        padding: 15,
        borderRadius: 12,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5, // Android
    },

    contenido: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    texto: {
        color: "#FFFFFF",
        fontSize: 14,
        flex: 1,
        paddingRight: 10,
    },

    usuario: {
        fontWeight: "bold",
        color: "#FF7A00", // color que destaque el usuario
    },

    botonCerrar: {
        backgroundColor: "#2C2C2C",
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    iconoCerrar: {
        color: "#FF4C4C",
        fontSize: 14,
        fontWeight: "bold",
    }

});

export default Tarjeta_Notificacion;