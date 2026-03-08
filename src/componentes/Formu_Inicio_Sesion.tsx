import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Mensaje from "./mensaje";

GoogleSignin.configure({
    webClientId: '354612197459-c5q1pro6hi6nicq41lelu9ishds5a8qj.apps.googleusercontent.com',
});

const Formu_Inicio_Sesion = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    // =============== Estados para mensaje ===============
    const [mostrar, setMostrar] = useState(false);
    const [textoMensaje, setTextoMensaje] = useState("");

    // Función helper para mostrar el mensaje
    const mostrarMensaje = (texto: string) => {
        setTextoMensaje(texto);
        setMostrar(true);
    };


    // =============== Iniciar Sesion de manera local ===============
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");

    const Iniciar_Sesion_Local = async () => {
        try {
            const res = await fetch('http://3.140.94.115:3001/usuarios/iniciar_sesion', {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({correo, contrasena})
            });

            if(!res.ok){
                return mostrarMensaje("No se pudo iniciar sesión")
            }

            const datos = await res.json();

            // Guardar token
            await AsyncStorage.setItem("token", datos.data.token);
            // const token = await AsyncStorage.getItem("token")
            // console.log(token)

            // Guardar usuario
            await AsyncStorage.setItem("usuario", JSON.stringify(datos.data));
            const usuarioStr = await AsyncStorage.getItem("usuario"); // Obtener usuario 
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : null; // parsearlo a json
            
            Alert.alert(`¡Hola ${usuario.nombre}!`);
            navigation.navigate('Perfil');

        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }


    // =============== Iniciar Sesion con google ===============
    const Iniciar_Sesion_Google = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            await GoogleSignin.signOut();

            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            if (!idToken) return mostrarMensaje("Error al iniciar sesion con Google");

            const res = await fetch('http://3.140.94.115:3001/usuarios/iniciar_sesion_google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            if (!res.ok) return mostrarMensaje("No se pudo iniciar sesión con Google");

            const datos = await res.json();

            await AsyncStorage.setItem("token", datos.data.token);
            console.log(datos.data.token)
            await AsyncStorage.setItem("usuario", JSON.stringify(datos.data));

            const usuarioStr = await AsyncStorage.getItem("usuario");
            const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

            Alert.alert(`¡Hola ${usuario.nombre}!`);
            navigation.navigate('Perfil');

        } catch (error) {
            console.log(`Error Google: ${error}`);
        }
    };


    return(
        <View style={styles.container}>

            <Mensaje
                visible={mostrar}
                mensaje={textoMensaje}
                duracion={3000}
                onOcultar={() => setMostrar(false)}
            />

            <Text style={styles.title}>Inicio de Sesión</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Correo</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="ejemplo@email.com"
                    placeholderTextColor="#999"
                    value={correo}
                    onChangeText={setCorreo}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Contraseña</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={contrasena}
                    onChangeText={setContrasena}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={Iniciar_Sesion_Local}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={Iniciar_Sesion_Google}>
                <Text style={styles.buttonText}>Entrar con Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registro')}>
                <Text style={styles.buttonText}>Crear Cuenta</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
        backgroundColor: "#f5f7fa",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 40,
        color: "#222",
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        marginBottom: 8,
        fontSize: 14,
        color: "#555",
    },
    input: {
        backgroundColor: "#fff",
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
        color: 'black'
    },
    button: {
        marginTop: 10,
        backgroundColor: "#4e73df",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default Formu_Inicio_Sesion;