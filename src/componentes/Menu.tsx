import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Menu = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    return(
        <View style={styles.container}>
            
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Inicio')}>
                <Text style={styles.icon}>🏠</Text>
                <Text style={styles.label}>Inicio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Subir_Post')}>
                <Text style={styles.icon}>➕</Text>
                <Text style={styles.label}>Subir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notificaciones')}>
                <Text style={styles.icon}>🔔</Text>
                <Text style={styles.label}>Notificaciones</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Perfil')}>
                <Text style={styles.icon}>👤</Text>
                <Text style={styles.label}>Perfil</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#ffffff",
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        elevation: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    item: {
        alignItems: "center",
    },
    icon: {
        fontSize: 20,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: "#555",
    },
});

export default Menu;