import React from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tarjeta_Post from "../componentes/Tarjeta_Post";
import Menu from "../componentes/Menu";


const Inicio = () => {
    return(
        <SafeAreaView style={styles.safeArea}>
            
            <View style={styles.container}>

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Foro</Text>
                        <Text style={styles.subtitle}>
                            Descubre y comparte recetas increíbles 🍲
                        </Text>
                    </View>

                    <Tarjeta_Post/>
                    <Tarjeta_Post/>
                    <Tarjeta_Post/>

                    {/* Espacio extra para que el último post no quede tapado */}
                    <View style={{ height: 90 }} />

                </ScrollView>

                {/* Menú fijo */}
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
    },
    scrollContainer: {
        paddingVertical: 20,
    },
    header: {
        paddingHorizontal: 20,
        marginBottom: 15,
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

export default Inicio;