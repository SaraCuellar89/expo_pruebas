import React, { useState } from "react";
import {Text,TextInput,TouchableOpacity,View,StyleSheet,Image,Alert,ScrollView,ActivityIndicator,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const API_URL = "https://tu-backend.com/api"; // 🔧 Cambia esto

const Formu_Subir_Post = () => {
const [titulo, setTitulo]             = useState("");
const [descripcion, setDescripcion]   = useState("");
const [ingredientes, setIngredientes] = useState("");
const [tiempo, setTiempo]             = useState("");
const [dificultad, setDificultad]     = useState("Facil");
const [imagen, setImagen] = useState<ImagePicker.ImagePickerAsset | null>(null);
const [cargando, setCargando]         = useState(false);

// ── Galería ────────────────────────────────────────────────────────────────
    const seleccionarImagen = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 0.8,
            });
            if (!result.canceled) setImagen(result.assets[0]);
        };

// ── Cámara ─────────────────────────────────────────────────────────────────
    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Se necesita permiso de cámara');
        
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled) setImagen(result.assets[0]);
    };

// ── Elegir fuente ──────────────────────────────────────────────────────────
const elegirFuente = () => {
    Alert.alert("Agregar imagen", "¿De dónde quieres subir la foto?", [
    { text: "Galería",  onPress: seleccionarImagen },
    { text: "Cámara",   onPress: tomarFoto },
    { text: "Cancelar", style: "cancel" },
    ]);
};

// ── Enviar al backend ──────────────────────────────────────────────────────
const publicar = async () => {
    if (!titulo.trim() || !imagen) {
    Alert.alert("Faltan datos", "El título y la imagen son obligatorios.");
    return;
    }

    setCargando(true);
    try {
    const form = new FormData();
    form.append("titulo",       titulo);
    form.append("descripcion",  descripcion);
    form.append("ingredientes", ingredientes);
    form.append("tiempo",       tiempo);
    form.append("dificultad",   dificultad);

    // El campo se llama "archivo" para coincidir con upload.single('archivo')
    form.append("archivo", {
        uri:  imagen.uri,
        name: imagen.fileName ?? "foto.jpg",
        type: imagen.type     ?? "image/jpeg",
    } as any);

    const token = "AQUI_VA_TU_JWT"; // 🔧 ej: await AsyncStorage.getItem("token")

    const res = await fetch(`${API_URL}/subir`, {
        method: "POST",
        headers: {
        Authorization: `Bearer ${token}`,
        // ⚠️ NO agregues Content-Type manualmente,
        // fetch lo genera solo con el boundary correcto
        },
        body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message ?? "Error al publicar");

    Alert.alert("¡Listo!", "Tu receta fue publicada.");
    // navigation.goBack()
    } catch (err: any) {
    Alert.alert("Error", err.message);
    } finally {
    setCargando(false);
    }
};

return (
    <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>Subir Receta 🍲</Text>

    {/* Selector de imagen */}
    <TouchableOpacity style={styles.imagePicker} onPress={elegirFuente}>
        {imagen ? (
        <Image source={{ uri: imagen.uri }} style={styles.preview} />
        ) : (
        <Text style={styles.imagePlaceholder}>📷  Toca para agregar foto</Text>
        )}
    </TouchableOpacity>

    <View style={styles.inputContainer}>
        <Text style={styles.label}>Título</Text>
        <TextInput
        style={styles.input}
        placeholder="Ej: Ajiaco Santafereño"
        value={titulo}
        onChangeText={setTitulo}
        />
    </View>

    <View style={styles.inputContainer}>
        <Text style={styles.label}>Descripción</Text>
        <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={3}
        placeholder="Describe tu receta..."
        value={descripcion}
        onChangeText={setDescripcion}
        />
    </View>

    <View style={styles.inputContainer}>
        <Text style={styles.label}>Ingredientes</Text>
        <TextInput
        style={[styles.input, styles.multiline]}
        multiline
        numberOfLines={4}
        placeholder="• Papa criolla..."
        value={ingredientes}
        onChangeText={setIngredientes}
        />
    </View>

    <View style={styles.row}>
        <View style={styles.halfInput}>
        <Text style={styles.label}>Tiempo</Text>
        <TextInput
            style={styles.input}
            placeholder="45 min"
            value={tiempo}
            onChangeText={setTiempo}
        />
        </View>

        <View style={styles.halfInput}>
        <Text style={styles.label}>Dificultad</Text>
        <View style={styles.pickerContainer}>
            <Picker
            selectedValue={dificultad}
            onValueChange={(v) => setDificultad(v)}
            >
            <Picker.Item label="Fácil"   value="Facil"   />
            <Picker.Item label="Media"   value="Media"   />
            <Picker.Item label="Difícil" value="Dificil" />
            </Picker>
        </View>
        </View>
    </View>

    <TouchableOpacity
        style={[styles.button, cargando && { opacity: 0.7 }]}
        onPress={publicar}
        disabled={cargando}
    >
        {cargando
        ? <ActivityIndicator color="#fff" />
        : <Text style={styles.buttonText}>Publicar</Text>
        }
    </TouchableOpacity>
    </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 40,
    backgroundColor: "#f5f7fa",
},
title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#222",
},
imagePicker: {
    height: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
},
preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
},
imagePlaceholder: {
    fontSize: 15,
    color: "#aaa",
},
inputContainer: {
    marginBottom: 18,
},
label: {
    marginBottom: 6,
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
    fontSize: 15,
},
multiline: {
    textAlignVertical: "top",
},
row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
},
halfInput: {
    width: "48%",
},
pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
},
button: {
    backgroundColor: "#f6c23e",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    elevation: 4,
},
buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
},
});

export default Formu_Subir_Post;