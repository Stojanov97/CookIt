import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Pressable, TextInput } from "react-native-gesture-handler";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";

const register = () => {
  const [logged, setLogged] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  return (
    <View style={styles.container}>
      <View style={{ ...styles.signIn, height: 350 }}>
        <ThemedText style={styles.header}>Register</ThemedText>
        <View style={styles.credentialCont}>
          <TextInput
            style={styles.input}
            value={name}
            onChange={(e) => {
              setName(e.nativeEvent.text);
            }}
            placeholder="Full Name"
            placeholderTextColor={"black"}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChange={(e) => {
              setEmail(e.nativeEvent.text);
            }}
            placeholder="Email"
            placeholderTextColor={"black"}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"black"}
            secureTextEntry={true}
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
            value={password}
          />
          <Pressable style={styles.signBtn} onPress={() => setLogged(true)}>
            <ThemedText style={styles.text}>Register</ThemedText>
          </Pressable>
          <Link href="/login">
            <ThemedText style={styles.link}>Login</ThemedText>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "600",
  },
  signIn: {
    backgroundColor: "#40bfad",
    padding: 15,
    width: 250,
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    height: 280,
  },
  header: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
  },
  credentialCont: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  signBtn: {
    backgroundColor: "#25292e",
    padding: 20,
    display: "flex",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  input: {
    width: 220,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "black",
  },
  link: {
    color: "#3a02a5",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
