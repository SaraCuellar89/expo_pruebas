import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Formu_Registro = () => {

    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    // =============== Funcion para Registrar Usuario ===============
    
    const [nombre_usuario, setNombre_usuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [confirmacion_contrasena, setConfirmacion_contrasena] = useState("");
    const [avatar, setAvatar] = useState("");

    // En Formu_Registro.tsx

const Registrar_Usuario = async () => {
    const emailRegex = /^[^@\s]+@[^@\s]+\.(com)$/;

    if (!emailRegex.test(correo)) return Alert.alert("El correo no es valido");
    if (contrasena.length < 5) return Alert.alert("La contraseña debe tener mas de 5 caracteres");

    try {
        // 1️⃣ Registrar
        const res = await fetch('http://3.140.94.115:3001/usuarios/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre_usuario, correo, contrasena, confirmacion_contrasena, avatar })
        });

        if (!res.ok) return Alert.alert('No se pudo realizar el registro');

        // 2️⃣ Login automático con las mismas credenciales
        const resLogin = await fetch('http://3.140.94.115:3001/usuarios/iniciar_sesion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contrasena })
        });

        if (!resLogin.ok) return Alert.alert('Registro exitoso pero no se pudo iniciar sesión');

        const datos = await resLogin.json();

        // 3️⃣ Guardar token y usuario igual que en el login
        await AsyncStorage.setItem("token", datos.data.token);
        await AsyncStorage.setItem("usuario", JSON.stringify(datos.data));

        const usuarioStr = await AsyncStorage.getItem("usuario");
        const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;

        Alert.alert(`¡Hola ${usuario.nombre}!`);
        navigation.navigate('Perfil'); // o la pantalla que uses post-login

    } catch (error) {
        console.log(`Error: ${error}`);
    }
}

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Registro</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre de Usuario</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="usuario_1"
                    placeholderTextColor="#999"
                    value={nombre_usuario}
                    onChangeText={setNombre_usuario}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Avatar</Text>
                <TextInput 
                    style={styles.input}
                    placeholderTextColor="#999"
                    value={avatar}
                    onChangeText={setAvatar}
                />
            </View>

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

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmación de Contraseña</Text>
                <TextInput 
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#999"
                    secureTextEntry
                    value={confirmacion_contrasena}
                    onChangeText={setConfirmacion_contrasena}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={Registrar_Usuario}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inicio')}>
                <Text style={styles.buttonText}>Ya tengo una cuenta</Text>
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
        color: "black"
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

export default Formu_Registro;