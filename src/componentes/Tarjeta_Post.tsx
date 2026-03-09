// componentes/Tarjeta_Post.tsx
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Contenido_HTML from "../helpers/Contenido_HTML";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface Plato {
    id_publicacion: number;
    titulo: string;
    descripcion: string;
    ingredientes: string;
    preparacion: string;
    archivo: string | null;
    tiempo_preparacion: number;
    dificultad: string;
    fecha_creacion: string;
    id_usuario: number;
}

const Tarjeta_Post = ({ plato }: { plato: Plato }) => {

    const Reaccionar = async (id_publicacion: any) => {
        const usuarioStr = await AsyncStorage.getItem("usuario");
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
        const token = usuario?.token;

        const res = await fetch(`http://3.140.94.115:3001/reacciones/reaccionar/${id_publicacion}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        const datos = await res.json();

        if(!res.ok) return Alert.alert('Error', 'No se pudo reaccionar a esta publicacion');

        if(datos.data.length === 0) return Alert.alert('Exito', 'Quitaste la reaccion a esta publicacion');
        else return Alert.alert('Exito', 'Reaccionaste a esta publicacion');
    } 


    return (
        <View style={styles.card}>
        <Text style={styles.titulo}>{plato.titulo}</Text>

        {plato.archivo && (
            <Image source={{ uri: plato.archivo }} style={styles.imagen} />
        )}

        <Text style={styles.label}>Descripción</Text>
        <Contenido_HTML
            contenido={plato.descripcion}
            estiloTexto={styles.texto}
        />

        <Text style={styles.label}>Ingredientes</Text>
        <Contenido_HTML
            contenido={plato.ingredientes}
            estiloTexto={styles.texto}
        />

        <Text style={styles.label}>Preparación</Text>
        <Contenido_HTML
            contenido={plato.preparacion}
            estiloTexto={styles.texto}
        />

        <View style={styles.footer}>
            <Text style={styles.meta}>⏱ {plato.tiempo_preparacion} min</Text>
            <Text style={styles.meta}>📊 {plato.dificultad}</Text>
            <TouchableOpacity onPress={() => Reaccionar(plato.id_publicacion)}>
                <Text>♥️</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 10,
    },
    imagen: {
        width: "100%",
        height: 200,
        borderRadius: 8,
        marginBottom: 12,
    },
    label: {
        fontSize: 13,
        fontWeight: "600",
        color: "#888",
        marginTop: 10,
        marginBottom: 2,
        textTransform: "uppercase",
    },
    texto: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        gap: 12,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    meta: {
        fontSize: 13,
        color: "#666",
    },
});

export default Tarjeta_Post;