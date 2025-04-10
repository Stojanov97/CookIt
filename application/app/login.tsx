import { router } from "expo-router";
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import { useSession } from "../ctx";
import { useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { HOST_URL as host } from "@/constants/Host";

export default function Login() {
  const { signIn } = useSession();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const login = async () => {
    try {
      await fetch(`${host}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log(data);
          if (data.err) {
            alert(data.err);
          } else {
            signIn(data.userData);
            router.replace("/");
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={styles.signIn}>
          <ThemedText style={styles.header}>Login</ThemedText>
          <View style={styles.credentialCont}>
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
            <Pressable
              style={styles.signBtn}
              onPress={() => {
                if (email.length === 0 || password.length === 0) {
                  alert("Please fill in all fields");
                } else {
                  login();
                }
              }}
            >
              <ThemedText style={styles.text}>Log in</ThemedText>
            </Pressable>
            <Link href="/register">
              <ThemedText style={styles.link}>Register</ThemedText>
            </Link>
          </View>
        </View>
      </ThemedView>
    </>
  );
}

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
    paddingTop: 15,
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
