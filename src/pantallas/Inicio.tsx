import React, { useEffect } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Tarjeta_Post from "../componentes/Tarjeta_Post";
import Menu from "../componentes/Menu";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Inicio = () => {

    useEffect(() => {
        const Obtener_Platos = async () => {

            const usuarioStr = await AsyncStorage.getItem("usuario");
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
            const token = usuario?.token;
    
            const res = await fetch('http://3.140.94.115:3001/publicaciones/todas', {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`
                }
            })

            const datos = await res.json()

            console.log(datos)
        } 

        Obtener_Platos()
    }, [])

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