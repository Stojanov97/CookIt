import { StyleSheet, View, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { Link, router } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { useSession } from "../ctx";
import { HOST_URL as host } from "@/constants/Host";

// Main Register component
const Register = () => {
  const { signIn } = useSession(); // Custom hook to manage session
  const [email, setEmail] = useState<string>(""); // State for email input
  const [password, setPassword] = useState<string>(""); // State for password input
  const [name, setName] = useState<string>(""); // State for first name input
  const [lastName, setLastName] = useState<string>(""); // State for last name input

  // Function to handle user registration
  const register = async () => {
    try {
      await fetch(`${host}/api/v1/auth/register`, {
        method: "POST", // HTTP POST request
        headers: {
          "Content-Type": "application/json", // JSON content type
        },
        body: JSON.stringify({
          email,
          password,
          name,
          lastName, // Sending user data to the server
        }),
      })
        .then((response) => response.json()) // Parse response as JSON
        .then((data) => {
          if (data.err) {
            alert(data.err); // Show error message if registration fails
          } else {
            signIn(data.userData); // Sign in user on successful registration
            router.replace("/"); // Redirect to home page
          }
        });
    } catch (error) {
      console.log(error); // Log any errors
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.signIn}>
        <ThemedText style={styles.header}>Register</ThemedText>
        <View style={styles.credentialCont}>
          {/* Input for first name */}
          <TextInput
            style={styles.input}
            value={name}
            onChange={(e) => {
              setName(e.nativeEvent.text);
            }}
            placeholder="Name"
            placeholderTextColor={"black"}
          />
          {/* Input for last name */}
          <TextInput
            style={styles.input}
            value={lastName}
            onChange={(e) => {
              setLastName(e.nativeEvent.text);
            }}
            placeholder="Lastname"
            placeholderTextColor={"black"}
          />
          {/* Input for email */}
          <TextInput
            style={styles.input}
            value={email}
            onChange={(e) => {
              setEmail(e.nativeEvent.text);
            }}
            placeholder="Email"
            placeholderTextColor={"black"}
          />
          {/* Input for password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={"black"}
            secureTextEntry={true} // Mask password input
            onChange={(e) => {
              setPassword(e.nativeEvent.text);
            }}
            value={password}
          />
          {/* Register button */}
          <Pressable
            style={styles.signBtn}
            onPress={() => {
              if (
                email.length === 0 ||
                password.length === 0 ||
                name.length === 0
              ) {
                alert("Please fill in all fields"); // Validate required fields
              } else {
                register(); // Call register function
              }
            }}
          >
            <ThemedText style={styles.text}>Register</ThemedText>
          </Pressable>
          {/* Link to login page */}
          <Link href="/login">
            <ThemedText style={styles.link}>Login</ThemedText>
          </Link>
        </View>
      </View>
    </ThemedView>
  );
};

export default Register;

// Styles for the Register component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Center content vertically and horizontally
  },
  text: {
    color: "white",
    fontWeight: "600", // Bold text
  },
  signIn: {
    backgroundColor: "#40bfad", // Background color for the form
    padding: 15,
    width: 250,
    display: "flex",
    gap: 20, // Space between elements
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15, // Rounded corners
    height: 390, // Fixed height for the form
  },
  header: {
    color: "white",
    fontSize: 35, // Large font size for the header
    fontWeight: "bold",
    paddingTop: 15,
  },
  credentialCont: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 10, // Space between input fields
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  signBtn: {
    backgroundColor: "#25292e", // Button background color
    padding: 20,
    display: "flex",
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15, // Rounded corners for the button
  },
  input: {
    width: 220, // Fixed width for input fields
    backgroundColor: "white",
    borderRadius: 10, // Rounded corners for input fields
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: "black", // Text color for input fields
  },
  link: {
    color: "#3a02a5", // Link text color
    fontWeight: "600",
    textDecorationLine: "underline", // Underline for the link
  },
});
