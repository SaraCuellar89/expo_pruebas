import React, { useState, useRef } from "react";
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import {
  Text, TextInput, TouchableOpacity, View, StyleSheet,
  Image, Alert, ScrollView, ActivityIndicator,
  KeyboardAvoidingView, Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Mensaje from "./mensaje";

const Formu_Subir_Post = () => {

  // =============== Estados para mensaje ===============
  const [mostrar, setMostrar] = useState(false);
  const [textoMensaje, setTextoMensaje] = useState("");

  // Función helper para mostrar el mensaje
  const mostrarMensaje = (texto: string) => {
      setTextoMensaje(texto);
      setMostrar(true);
  };


  const editorRef = useRef<any>(null);
  const ingredientesRef = useRef<any>(null);
  

  // =================== Estados del Formulario ===================
  const [titulo, setTitulo]           = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [ingredientes, setIngredientes] = useState("<ul><li></li></ul>");
  const [preparacion, setPreparacion] = useState("");
  const [tiempo, setTiempo]           = useState("");
  const [dificultad, setDificultad]   = useState("Facil");
  const [imagen, setImagen]           = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [cargando, setCargando]       = useState(false);


  // =================== Abrir la Galería ===================
  const seleccionarImagen = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) setImagen(result.assets[0]);
  };


  // =================== Abrir la camara ===================
  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return mostrarMensaje("Se necesita permiso de camara");
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) setImagen(result.assets[0]);
  };


  // =================== Elegir opciones para la imagen (Galeria, Camara o Cancelar) ===================
  const elegirFuente = () => {
    Alert.alert("Agregar imagen", "¿De dónde quieres subir la foto?", [
      { text: "Galería", onPress: seleccionarImagen },
      { text: "Cámara",  onPress: tomarFoto },
      { text: "Cancelar", style: "cancel" },
    ]);
  };


  // =================== Funcion para subir plato ===================
  const publicar = async () => {
    if (!titulo.trim()) {
      return mostrarMensaje("El titulo es obligatorio");
    }
    setCargando(true);
    try {
      const form = new FormData();
      form.append("titulo",            titulo);
      form.append("descripcion",       descripcion);
      form.append("ingredientes",      ingredientes);
      form.append("preparacion",       preparacion);
      form.append("tiempo_preparacion", tiempo);
      form.append("dificultad",        dificultad);

      // Configuracion para subir la imagen al backend
      if (imagen) {
        form.append("archivo", {
          uri:  imagen.uri,
          name: imagen.fileName ?? "foto.jpg",
          type: imagen.mimeType ?? "image/jpeg",
        } as any);
      }

      // Obtener usuarii del localstorage
      const usuarioStr = await AsyncStorage.getItem("usuario");
      const usuario = usuarioStr ? JSON.parse(usuarioStr) : null;
      const token = usuario?.token;

      const res = await fetch(`http://3.140.94.115:3001/publicaciones/subir`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message ?? "Error al publicar");
      return mostrarMensaje("Receta publicada");

    } catch (err: any) {
      Alert.alert("Error", err.message);

    } finally {
      setCargando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Mensaje
            visible={mostrar}
            mensaje={textoMensaje}
            duracion={3000}
            onOcultar={() => setMostrar(false)}
        />
        <Text style={styles.title}>Subir Receta 🍲</Text>

        {/* Imagen de portada */}
        <TouchableOpacity style={styles.imagePicker} onPress={elegirFuente}>
          {imagen ? (
            <Image source={{ uri: imagen.uri }} style={styles.preview} />
          ) : (
            <Text style={styles.imagePlaceholder}>📷  Toca para agregar foto de portada</Text>
          )}
        </TouchableOpacity>

        {/* Título */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Ajiaco Santafereño"
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Descripción con editor rich text */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descripción</Text>

          {/* Toolbar fijo arriba */}
          <RichToolbar
            editor={editorRef}
            actions={[
              actions.setBold,
              actions.setItalic,
              actions.setUnderline,
              actions.heading1,
              actions.heading2,
              actions.heading3,
              actions.insertBulletsList,
              actions.insertOrderedList,
              actions.alignLeft,
              actions.alignCenter,
              actions.alignRight,
              actions.insertLink,
            ]}
          />

          <RichEditor
            ref={editorRef}
            initialContentHTML={descripcion}
            onChange={setDescripcion}
            placeholder="Describe tu receta..."
            style={styles.richEditor}
          />
        </View>

        {/* Ingredientes */}
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Ingredientes</Text>

            <RichEditor
                ref={ingredientesRef}
                initialContentHTML={ingredientes}
                onChange={(html) => {
                // Si el usuario borra todo, restaurar la lista
                if (!html || html === "<br>" || html === "<p></p>") {
                    ingredientesRef.current?.setContentHTML("<ul><li></li></ul>");
                    setIngredientes("<ul><li></li></ul>");
                } else {
                    setIngredientes(html);
                }
                }}
                placeholder="Papa criolla..."
                style={styles.richEditor}
            />
        </View>

        {/* Preparación */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preparación</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            multiline
            value={preparacion}
            onChangeText={setPreparacion}
          />
        </View>

        {/* Tiempo y dificultad */}
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
              <Picker selectedValue={dificultad} onValueChange={(v) => setDificultad(v)}>
                <Picker.Item label="Fácil"   value="Facil"   />
                <Picker.Item label="Media"   value="Media"   />
                <Picker.Item label="Difícil" value="Dificil" />
              </Picker>
            </View>
          </View>
        </View>

        {/* Botón publicar */}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#222",
    textAlign: "center",
  },
  imagePicker: {
    height: 190,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    fontSize: 15,
    color: "#9ca3af",
  },
  inputContainer: {
    marginBottom: 100,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    fontSize: 15,
    color: "#111",
  },
  multiline: {
    textAlignVertical: "top",
    minHeight: 90,
  },
  toolbar: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  richEditor: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderTopWidth: 0,
    minHeight: 140,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  halfInput: {
    width: "48%"
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#f6c23e",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});

export default Formu_Subir_Post;