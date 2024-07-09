import React, { useLayoutEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Input } from "react-native-elements";
import { db } from "../firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, addDoc } from "firebase/firestore";

const AddChatScreen = ({ navigation }) => {
    const [input, setInput] = useState("");
    const scrollViewRef = useRef(null);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Add a new Chat",
            headerBackTitle: "Chats",
        });
    }, [navigation]);

    const createChat = async () => {
        await addDoc(collection(db, "chats"), {
            chatName: input,
        })
            .then(() => {
                navigation.goBack();
            })
            .catch((error) => alert(error));
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
                keyboardVerticalOffset={90}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    ref={scrollViewRef}
                >
                    <Input
                        placeholder="Enter a chat name"
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        leftIcon={
                            <Icon name="wechat" type="antdesign" size={24} color="black" />
                        }
                    />
                    <Button disabled={!input} onPress={createChat} title="Create new Chat" />
                    <Text style={styles.infoText}>Add Chat Screen</Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default AddChatScreen;

const styles = StyleSheet.create({
    container: {
        height:"100%",
        backgroundColor: "white",
        padding: 30,
    }
});
