import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { KeyboardAvoidingView } from "react-native";
import { auth, getAuth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            navigation.replace("Home");
            }
        });
        return unsubscribe;  // return () => { unsubscribe()}
    }, []);
    
    const signIn = () => {
        signInWithEmailAndPassword(auth,email, password).catch((error) => alert(error));
    };

    return (
        <KeyboardAvoidingView behavior='padding' style={styles.container}>
            <StatusBar style="light" />
            <Image source={{
                uri: "https://assets.mofoprod.net/network/images/signal_logo.width-250.jpg",
            }}
            style={{ width: 200, height: 200 }}
        />
        <View style={styles.inputContainer}>
            <Input 
            placeholder="Email"
            autoFocus type="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
             />
            <Input placeholder="Password"
            secureTextEntry type="password"
              value={password}
            onChangeText={(text) => setPassword(text)}
            onSubmitEditing={signIn} />
        </View>
        <Button containerStyle={styles.button} onPress={signIn} title='Login'/>
        <Button onPress={() => navigation.navigate("Register")} containerStyle={styles.button} type="outline" title='Register'/>
        <View style={{ height: 100 }} />
        </KeyboardAvoidingView>
      );
    };
export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"

    },
    inputContainer: {
        width:300
    },
    button: {
        width: 200,
        marginTop: 10
    },
     
});