import React, { useEffect, useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import CustomListitem from "../components/CustomListitem"
import { Avatar } from "react-native-elements";
import { auth, db, getAuth, storage } from "../firebase"
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { collection, onSnapshot } from "firebase/firestore";

const HomeScreen = ({navigation}) => {
    const [chats, setChats] = useState([]);
    const [lastMessages, setLastMessages] = useState({});
    const [user, setUser] = useState(null); // State to store the current user
    let uuseri = "";
    const signOutUser = () => {
        signOut(auth).then(() => {
            navigation.replace("Login");
        });
    }
    
    
    useEffect(() => { 
        if (uuseri.displayName !== null) {
        const unsubscribe = onSnapshot(collection(db , 'chats'), (snapshot) => (
           
            setChats(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data(),
                    
                }
            )) 
            
        )))
        return unsubscribe;
    }}, []);
    
    useEffect(() => {
        if (chats.length === 0) return;
    
        const sortedChats = [...chats].sort((a, b) => {
          const lastMessageA = lastMessages[a.id] || 0;
          const lastMessageB = lastMessages[b.id] || 0;
          return lastMessageB - lastMessageA;
        });
        setChats(sortedChats);
        console.log("tamarendröi1")
      }, [lastMessages]);

    useLayoutEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            uuseri = authUser;
            if (authUser.displayName !== null) {
                setUser(authUser); // Set user data

        navigation.setOptions({
            title: auth.currentUser.displayName || "LOADINGG....",
            headerStyle: { backgroundColor: "#fff" },
            headerTitleStyle: { color: "black" },
            headerTintColor: "black",
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Pressable onPressOut={signOutUser}>
                    <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
                    </Pressable>
                </View>
            ),
            headerRight: () => (
                <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 80,
                    marginRight: 20,
                    
                }}
                >
                    <Pressable>
                        <AntDesign name="camerao" size={24} color="black" />
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate("AddChat")}>
                        <SimpleLineIcons name="pencil" size={24} color="black" />
                    </Pressable>
                </View>
        )
        });
    }
})
return unsubscribe;
 }, [navigation]);
    
    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id,
            chatName
        });
    };
    const handleLastMessage = (id, timestamp) => {
        setLastMessages((prev) => ({ ...prev, [id]: timestamp }));
      };
 
    return (
        <SafeAreaView style={{ flex: 1, }}>
            <ScrollView style={styles.container}>
                {chats.map(({ id,  data: { chatName } }) => (
                    <CustomListitem key={id} id={id} chatName={chatName} enterChat={enterChat} onLastMessage={handleLastMessage} />
                ))}
            </ScrollView>
        </SafeAreaView>
    )}
    export default HomeScreen
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
        }
    })