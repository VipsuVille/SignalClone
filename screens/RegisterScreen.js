import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View, Pressable, KeyboardAvoidingView, Image } from "react-native";
import { Button, Input, Text } from "react-native-elements";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const auth = getAuth();
  const storage = getStorage();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to LOGFIN",
    });
  }, [navigation]);

  const register = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        updateProfile(auth.currentUser, {
          displayName: name,
          photoURL:
            imageUrl ||
            "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Trollface_non-free.png/220px-Trollface_non-free.png",
        });
      })
      .catch((error) => alert(error.message));
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
      setSelectedImage(uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50 }}>
        Please register first
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full Name"
          autoFocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          type="password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <Button containerStyle={styles.button} raised onPress={pickImageAsync} title="Pick an Image" />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <Button containerStyle={styles.button} raised onPress={register} title="Register" />
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
  },
});

export default RegisterScreen;
