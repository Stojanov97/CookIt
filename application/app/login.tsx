import { router } from "expo-router"; // Used for navigation between screens
import { StyleSheet, View, Pressable, TextInput } from "react-native"; // React Native components for UI
import { useSession } from "../ctx"; // Custom hook to manage user session
import { useState } from "react"; // React hook for managing state
import { ThemedView } from "@/components/ThemedView"; // Custom themed wrapper for views
import { ThemedText } from "@/components/ThemedText"; // Custom themed text component
import { Link } from "expo-router"; // Link component for navigation
import { HOST_URL as host } from "@/constants/Host"; // Base URL for API requests

export default function Login() {
  const { signIn } = useSession(); // Function to update session state after login
  const [email, setEmail] = useState<string>(""); // State to store email input
  const [password, setPassword] = useState<string>(""); // State to store password input

  // Function to handle login logic
  const login = async () => {
    try {
      await fetch(`${host}/api/v1/auth/login`, {
        method: "POST", // HTTP POST method for login
        headers: {
          "Content-Type": "application/json", // JSON content type
        },
        body: JSON.stringify({
          email, // Email entered by the user
          password, // Password entered by the user
        }),
      })
        .then((response) => response.json()) // Parse JSON response
        .then((data) => {
          if (data.err) {
            alert(data.err); // Show error message if login fails
          } else {
            signIn(data.userData); // Update session with user data
            router.replace("/"); // Navigate to the home screen
          }
        });
    } catch (error) {
      console.log(error); // Log any errors during the login process
    }
  };

  return (
    <>
      <ThemedView style={styles.container}>
        <View style={styles.signIn}>
          <ThemedText style={styles.header}>Login</ThemedText>{" "}
          {/* Header text */}
          <View style={styles.credentialCont}>
            <TextInput
              style={styles.input}
              value={email} // Bind email state to input
              onChange={(e) => {
                setEmail(e.nativeEvent.text); // Update email state on input change
              }}
              placeholder="Email" // Placeholder text for email input
              placeholderTextColor={"black"} // Placeholder text color
            />
            <TextInput
              style={styles.input}
              placeholder="Password" // Placeholder text for password input
              placeholderTextColor={"black"} // Placeholder text color
              secureTextEntry={true} // Hide password input
              onChange={(e) => {
                setPassword(e.nativeEvent.text); // Update password state on input change
              }}
              value={password} // Bind password state to input
            />
            <Pressable
              style={styles.signBtn}
              onPress={() => {
                if (email.length === 0 || password.length === 0) {
                  alert("Please fill in all fields"); // Alert if fields are empty
                } else {
                  login(); // Call login function
                }
              }}
            >
              <ThemedText style={styles.text}>Log in</ThemedText>{" "}
              {/* Button text */}
            </Pressable>
            <Link href="/register">
              {" "}
              {/* Link to the registration screen */}
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
    flex: 1, // Full-screen container
    alignItems: "center", // Center align items horizontally
    justifyContent: "center", // Center align items vertically
  },
  text: {
    color: "white", // White text color
    fontWeight: "600", // Semi-bold font weight
  },
  signIn: {
    backgroundColor: "#40bfad", // Background color for the login box
    padding: 15, // Padding inside the box
    width: 250, // Width of the login box
    display: "flex", // Flexbox layout
    gap: 20, // Space between child elements
    justifyContent: "space-between", // Space out child elements
    alignItems: "center", // Center align child elements
    borderRadius: 15, // Rounded corners
    height: 280, // Height of the login box
  },
  header: {
    color: "white", // White text color
    fontSize: 35, // Large font size for the header
    fontWeight: "bold", // Bold font weight
    paddingTop: 15, // Padding at the top
  },
  credentialCont: {
    paddingHorizontal: 20, // Horizontal padding
    paddingTop: 10, // Padding at the top
    gap: 10, // Space between child elements
    display: "flex", // Flexbox layout
    justifyContent: "center", // Center align child elements vertically
    alignItems: "center", // Center align child elements horizontally
    flex: 1, // Take up remaining space
  },
  signBtn: {
    backgroundColor: "#25292e", // Button background color
    padding: 20, // Padding inside the button
    display: "flex", // Flexbox layout
    width: 200, // Button width
    justifyContent: "center", // Center align text vertically
    alignItems: "center", // Center align text horizontally
    borderRadius: 15, // Rounded corners
  },
  input: {
    width: 220, // Input field width
    backgroundColor: "white", // Input field background color
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 15, // Horizontal padding inside the input
    paddingVertical: 10, // Vertical padding inside the input
    color: "black", // Text color
  },
  link: {
    color: "#3a02a5", // Link text color
    fontWeight: "600", // Semi-bold font weight
    textDecorationLine: "underline", // Underline the link text
  },
});
