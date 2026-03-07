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


export type RootStackParamList = {
  Inicio_Sesion: undefined,
  Registro: undefined,
  Inicio: undefined,
  Subir_Post: undefined,
  Perfil: undefined,
  Editar_Perfil: undefined,
  Notificaciones: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Inicio_Sesion'>
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