// src/helpers/Registrar_Token.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const registrarTokenFCM = async () => {

    // Pedir permiso
    const permiso = await messaging().requestPermission();
    
    const autorizado =
        permiso === messaging.AuthorizationStatus.AUTHORIZED ||
        permiso === messaging.AuthorizationStatus.PROVISIONAL;

    if (!autorizado) {
        console.log("Permiso denegado");
        return;
    }

    // Token FCM nativo
    const fcm_token = await messaging().getToken();
    console.log("Token FCM:", fcm_token);

    const usuarioStr = await AsyncStorage.getItem("usuario");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
    const token = usuario?.token;

    const res = await fetch('http://3.140.94.115:3001/tokenFCM/guardar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ fcm_token })
    });

    const datos = await res.json();
    console.log(datos);
};