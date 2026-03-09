import 'react-native-gesture-handler';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Inicio_Sesion from './src/pantallas/Inicio_Sesion';
import Registro from './src/pantallas/Registro';
import Inicio from './src/pantallas/Inicio';
import Subir_Post from './src/pantallas/Subir_Post';
import Perfil from './src/pantallas/Perfil';
import Editar_Perfil from './src/pantallas/Editar_Perfil';
import Notificaciones from './src/pantallas/Notificaciones';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { registrarTokenFCM } from './src/helpers/Registrar_Token';


export type RootStackParamList = {
  Inicio_Sesion: undefined,
  Registro: undefined,
  Inicio: undefined,
  Subir_Post: undefined,
  Perfil: undefined,
  Editar_Perfil: undefined,
  Notificaciones: undefined,
}

// Notificaciones 
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Notificación en background:', remoteMessage);
});


const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {

  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

    useEffect(() => {
        // ✅ Verificar usuario guardado
        const checkUsuario = async () => {
            try {
                const usuario = await AsyncStorage.getItem('usuario');
                setInitialRoute(usuario ? 'Inicio' : 'Inicio_Sesion');
                if (usuario) {
                await registrarTokenFCM();
            }
            } catch {
                setInitialRoute('Inicio_Sesion');
            }
        };
        checkUsuario();

        const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
            console.log('Notificación en foreground:', remoteMessage);
            // Mostrar alerta manual porque Firebase no la muestra en foreground
            Alert.alert(
                remoteMessage.notification?.title ?? 'Nueva notificación',
                remoteMessage.notification?.body ?? ''
            );
        });

        return () => unsubscribeForeground();
    }, []);

  // Espera hasta saber qué ruta usar
  if (!initialRoute) return null;


  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen 
            name="Inicio_Sesion" 
            component={Inicio_Sesion} 
            options={{ 
                headerShown: false 
            }}
        />
        <Stack.Screen 
            name="Registro" 
            component={Registro} 
            options={{ 
                headerShown: false 
            }}
        />
        <Stack.Screen 
            name="Inicio" 
            component={Inicio} 
            options={{ 
                headerShown: false 
            }}
        />
        <Stack.Screen 
            name="Subir_Post" 
            component={Subir_Post} 
            options={{ 
                headerShown: false 
            }}
        />
        <Stack.Screen 
            name="Perfil" 
            component={Perfil} 
            options={{ 
                headerShown: false 
            }}
        />
        <Stack.Screen 
            name="Editar_Perfil" 
            component={Editar_Perfil} 
            options={{ 
                headerShown: true 
            }}
        />
        <Stack.Screen 
            name="Notificaciones" 
            component={Notificaciones} 
            options={{ 
                headerShown: true 
            }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  )
}

export default App;