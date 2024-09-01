import React, { useLayoutEffect, useState, useRef } from 'react'
import {scrollToEnd, TouchableWithoutFeedback,KeyboardAvoidingView, TextInput ,Pressable, StyleSheet, Text, View, SafeAreaView, Platform ,ScrollView, Keyboard, Touchable} from "react-native";
import { Avatar } from "react-native-elements"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { query, orderBy, onSnapshot, collection, addDoc, Timestamp, Firestore, serverTimestamp, doc } from "firebase/firestore";
//import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { auth, db } from '../firebase';


//ChatScreen for invidual chats using route to get
// unique information from chats
const ChatScreen = ({ navigation, route }) => {
const [input, setInput] = useState('');
const [messages, setMessages] = useState([]);
const scrollViewRef = useRef(null);
    useLayoutEffect(() => {
    navigation.setOptions({
        title: "Chätti",
        headerBackTitleVisible: false,
        headerTitleAlign: "left",
        headerTitle: () => (
            console.log(messages[0]?.data),
            <View style = {{
                flexDirection: "row",
                alignItems: "center",
            }}
            >
                <Avatar
                    rounded
                    source={{
                    uri: messages[0]?.data.photoURL
                    }}
                />
            <Text
                style ={{ color: "black", marginLeft: 10, fontWeight: "700" }}>
                    {route.params.chatName}
            </Text>
            </View>
            ),
            headerLeft: () => (
            <Pressable
                style={{marginLeft: 10 }}
                onPress={navigation.goBack}
            >
                <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            ),
            headerRight: () => (
            <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
            }}
            >
                <Pressable>
                    <FontAwesome name="video-camera" size={24} color="white" />
                </Pressable>
                <Pressable>
                    <Ionicons name="call" size={24} color="white" />
                </Pressable>
                </View>
             )})
            }, [navigation, messages]);

const sendMessage = () =>{
    Keyboard.dismiss();
    const DocRef = doc(db, "chats" ,route.params.id)
    addDoc(collection(DocRef,"messages"), {
        timestamp: serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
    });
    setInput("");
};

useLayoutEffect(() => {
    const docrefforLayoutEffect = doc(db , "chats" ,route.params.id)
    const messagesRefForLayoutEffect = query(collection(docrefforLayoutEffect, "messages"),
    orderBy("timestamp")
    )
    const unsubscribe = onSnapshot(messagesRefForLayoutEffect, (snapshot) => 
        setMessages(
            snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }))
        )
    );
return unsubscribe;
    },[route]);


return (
    
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <StatusBar style="light" />
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={90}
      >     
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <> 
          <ScrollView
           contentContainerStyle=
           {{ paddingTop: 15,  justifyContent:"flex-end",}}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            ref={scrollViewRef}>
                {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
        <View key={id} style={styles.reciever}>
            <Avatar
            position="absolute"
            rounded
            // For the web
            containerStyle={{
            position: "absolute",
            bottom:-15,
            right: -5
            }}
            bottom={-15}
            right={-5}
            size={30}
            source={{
            uri: data.photoURL
            }}
            />
        <Text style={styles.recieverText}>{data.message}</Text>
        </View>
        ) : (
        <View key={id} style={styles.sender}>
        <Avatar
            position="absolute"
            rounded
            // For the web
            containerStyle={{
            position: "absolute",
            bottom:-15,
            right: -5
            }}
            bottom={-15}
            right={-5}
            size={30}
            source={{
            uri: data.photoURL
            }}/>
            <Text style={styles.senderText}>{data.message}</Text>
            <Text style={styles.senderText}>{data.displayName}
            </Text>
            </View>
            )
            )}
    </ScrollView>
        <View style={styles.footer}>
            <TextInput
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={sendMessage}
            placeholder="Signal Message"
            style={styles.textInput}
            />
                <Pressable 
                      onPress={sendMessage}
                      activeOpacity={0.5}
                      >
                    <Ionicons name="send" size={24} color="#2B68E6" />
                </Pressable>
         </View>
            </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    </SafeAreaView>
        );
        };

export default ChatScreen;
const styles = StyleSheet.create({
    container: {
    flex: 1,
    },
    reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
    },
    sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
    },
    senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
    },
    recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    },
    senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
    },
    footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    },
    textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
    },
    });