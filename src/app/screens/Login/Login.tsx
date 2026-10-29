import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.content}>
        <View style={styles.header}>
            <Image 
                source={require('../../../../assets/images/fundo-login-mobile.png')}
                style={styles.imagemHeader}
                resizeMode="cover"
            />

            <View style={styles.overlay} />
        
            <Text style={styles.textoHeader}>Blog Tech Mobile</Text>
        </View>

        <Text style={styles.title}>Entrar</Text>
        
        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input}
          onChangeText={(inputText)=>setUser(inputText)}
          value={user}
          placeholder="nome@escola.edu.br"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput style={styles.input}
          onChangeText={(inputText)=>setPassword(inputText)}
          value={password}
          placeholder="Insira sua senha"
        />

        <StatusBar style="auto" />
        <TouchableOpacity style={styles.button} onPress={(e) => (e)}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
        backgroundColor: '#fff'
    },

    content: {
        alignItems: "center",
        justifyContent: "center"
    },
    
    header: {
        width: '100%',
        height: 230,
        alignItems: 'center',
        padding: 0,
        margin: 0
    },

    imagemHeader: {
        ...StyleSheet.absoluteFill,
        width: '100%',
        height: '100%',
    },

    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 80, 180, 0.75)',
    },

    textoHeader: {
        fontSize: 20,
        color: '#ffffff',
        marginTop: 150
    },
    
    title: {
        fontSize: 30,
        fontWeight: "800",
        marginTop: 50,
        marginBottom: 30
    },

    label: {
        fontSize: 20,
        fontWeight: "600",
        alignSelf: "flex-start",
        marginLeft: 30,
        marginBottom: 10
    },

    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        width: '90%',
        borderRadius: 15,
        paddingLeft: 15
    },

    button: {
        backgroundColor: '#0050b4',
        borderColor: '#0050b4',
        borderWidth: 8,
        width: '90%',
        alignItems: 'center',
        padding: 5,
        borderRadius: 15,
        marginTop: 10,
    },

    buttonText: {
        color: '#ffffff'
    }
});
