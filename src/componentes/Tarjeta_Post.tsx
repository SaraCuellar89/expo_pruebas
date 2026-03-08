import React, { useState } from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";

const Tarjeta_Post = () =>{

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);

    const toggleLike = () => {
        if(liked){
            setLikes(likes - 1);
        }else{
            setLikes(likes + 1);
        }
        setLiked(!liked);
    };

    return(
        <View style={styles.card}>

            <Image
                source={require('../img/prueba.png')}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.content}>
                <Text style={styles.title}>Titulo Plato</Text>
                <Text style={styles.description}>
                    Descripcion breve del plato para que se vea atractivo y delicioso.
                </Text>

                <Text style={styles.sectionTitle}>Ingredientes</Text>
                <Text style={styles.text}>• Ingrediente 1{"\n"}• Ingrediente 2{"\n"}• Ingrediente 3</Text>

                <Text style={styles.sectionTitle}>Preparación</Text>
                <Text style={styles.text}>
                    1. Paso uno{"\n"}
                    2. Paso dos{"\n"}
                    3. Paso tres
                </Text>

                <View style={styles.footer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>⏱ 30 min</Text>
                    </View>

                    <View style={[styles.badge, styles.badgeSecondary]}>
                        <Text style={styles.badgeText}>🔥 Media</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.likeContainer}
                        onPress={toggleLike}
                    >
                        <Text style={styles.likeText}>
                            {liked ? "❤️" : "🤍"}
                        </Text>
                        <Text style={styles.likeCount}>{likes}</Text>
                    </TouchableOpacity>

                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        marginVertical: 15,
        marginHorizontal: 20,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    image: {
        width: "100%",
        height: 200,
    },
    content: {
        padding: 18,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#222",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 5,
        color: "#333",
    },
    text: {
        fontSize: 14,
        color: "#444",
        lineHeight: 20,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 15,
    },
    badge: {
        backgroundColor: "#4e73df",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    badgeSecondary: {
        backgroundColor: "#f6c23e",
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
    },
    likeContainer:{
        flexDirection:"row",
        alignItems:"center",
        gap:5
    },
    likeText:{
        fontSize:20
    },
    likeCount:{
        fontSize:14,
        fontWeight:"600"
    }
});

export default Tarjeta_Post;