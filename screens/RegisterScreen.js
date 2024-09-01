import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Image, ActivityIndicator } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { Asset } from 'expo-asset';

const defaultImage = require("../images/docpic.jpeg");

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to login",
    });
  }, [navigation]);

  const handleImageUpload = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      throw new Error("Failed to upload image: " + error.message);
    }
  };

  const register = async () => {
    setLoading(true);
    try {
      let photoURL = imageUrl;

      if (!photoURL) {
        // Load default image if none is selected
        const asset = await Asset.fromModule(defaultImage).downloadAsync();
        photoURL = await handleImageUpload(asset.localUri);
      }

      const authUser = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Save user details in Firestore
      await setDoc(doc(db, "users", authUser.user.uid), {
        displayName: name,
        email: authUser.user.email,
        photoURL: photoURL,
      });

      console.log("User registered and data saved to Firestore.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      navigation.replace("Home"); // Directly go to Home

    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets.length <= 1) {
        const { uri } = result.assets[0];
        const downloadURL = await handleImageUpload(uri);
        setImageUrl(downloadURL);
        setSelectedImage(uri);
      } else {
        alert("Only one picture!");
      }
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text h3 style={{ marginBottom: 50 }}>
            Please register first
          </Text>
          <View style={styles.inputContainer}>
            <Input
              placeholder="Full Name"
              autoFocus
              type="text"
              value={name}
              onChangeText={setName}
            />
            <Input
              placeholder="Email (dont have to be real email)"
              type="email"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Password, atleast 6 letters/marks"
              type="password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Button containerStyle={styles.button} raised onPress={pickImageAsync} title="Pick an Image (optional)" />
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
          <Button containerStyle={styles.button} raised onPress={register} title="Register" />
        </>
      )}
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  button: {
    width: 200,
    marginTop: 10,
  },
  inputContainer: {
    width: 300,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 100, // Half of the width and height for a perfect circle
    borderWidth: 3, // Thickness of the border
    borderColor: 'black', // Color of the border  
  },
});

export default RegisterScreen;
