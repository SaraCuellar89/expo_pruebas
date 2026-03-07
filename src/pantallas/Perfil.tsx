import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tarjeta_Perfil from "../componentes/Tarjet_Perfil";
import Menu from "../componentes/Menu";

const Perfil = () => {
    return(
        <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.container}>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.header}>
                        <Text style={styles.title}>Mi Perfil</Text>
                        <Text style={styles.subtitle}>Gestiona tu información personal</Text>
                    </View>

                    <Tarjeta_Perfil/>

                    {/* Espacio para que no choque con el menú */}
                    <View style={{ height: 120 }} />

                </ScrollView>

                <Menu/>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },
    container: {
        flex: 1,
        position: "relative",
    },
    scrollContainer: {
        paddingTop: 30,
        paddingBottom: 20,
        paddingHorizontal: 20, // ← importante para que la card no quede pegada a los lados
    },
    header: {
        marginBottom: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 4,
    },
});

export default Perfil;