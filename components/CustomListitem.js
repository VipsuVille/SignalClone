import React, {useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { query, orderBy, onSnapshot, collection, doc } from "firebase/firestore";
import { db } from '../firebase';

const CustomListitem = ({ id, chatName, enterChat, onLastMessage }) => {
const [chatMessages, setChatMessages] = useState([]);useEffect(() => {
    const docrefforLayoutEffect = doc(db , "chats" , id)
    const messagesRefForLayoutEffect = query(collection(docrefforLayoutEffect, "messages"),
    orderBy("timestamp", "desc")
    )
    const unsubscribe = onSnapshot(messagesRefForLayoutEffect, (snapshot) => {
        const messages = snapshot.docs.map((doc) => doc.data());
        setChatMessages(messages);

        if ( messages[0].timestamp) {
            onLastMessage(id, messages[0]?.timestamp.seconds);
        }
    });
    
return unsubscribe;
}, [id]
);
const latestMessage = chatMessages?.[0] || {};
    const { displayName, message, timestamp, photoURL } = latestMessage;
return (
    <ListItem onPress={() => enterChat(id, chatName)} key={id} bottomDivider>
        <Avatar
            rounded
            source={{
                
                uri: chatMessages?.[0]?.photoURL 
            }}/>
    <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800"}}>
            {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
            {displayName}: {message}
        </ListItem.Subtitle>
    </ListItem.Content>
    </ListItem>

)
};

export default CustomListitem;
const styles = StyleSheet.create({});