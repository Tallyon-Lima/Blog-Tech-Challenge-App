import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <View style={styles.content}>
        <View style={styles.header}>
            <Image 
                source={require('../../../../assets/images/fundo-login-mobile.png')}
                style={styles.imagemHeader}
                resizeMode="cover"
            />

            <View style={styles.overlay} />
        
            <Image 
                source={require('../../../../assets/images/logo.png')}
                style={styles.iconeHeader}
                resizeMode="cover"
            />
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
        <View style={styles.containerSenha}>
            <TextInput 
                style={styles.inputSenha}
                onChangeText={(inputText)=>setPassword(inputText)}
                value={password}
                placeholder="Insira sua senha"
                secureTextEntry={!mostrarSenha}
            />
            <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Ionicons name={mostrarSenha ? 'eye-off' : 'eye'} size={24} color="#555"/>
            </TouchableOpacity>
        </View>

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

    iconeHeader: {
        marginTop: 140,
        marginLeft: 45,
        ...StyleSheet.absoluteFill,
        width: '15%',
        height: '20%',
        backgroundColor: 'rgba(246, 246, 246, 0.75)',
        borderRadius: 10
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

    containerSenha: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 15,
        paddingHorizontal: 10,
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
        paddingLeft: 15,
        flex: 1
    },

    inputSenha: {
        paddingLeft: 6,
        flex: 1
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
