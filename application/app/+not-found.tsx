import { Link, Stack } from "expo-router"; // Importing navigation components from expo-router
import { StyleSheet } from "react-native"; // Importing StyleSheet for styling

import { ThemedText } from "@/components/ThemedText"; // Custom themed text component
import { ThemedView } from "@/components/ThemedView"; // Custom themed view component

// Default export for the NotFoundScreen component
export default function NotFoundScreen() {
  return (
    <>
      {/* Setting the screen title to 'Oops!' */}
      <Stack.Screen options={{ title: "Oops!" }} />

      {/* Themed container for the screen */}
      <ThemedView style={styles.container}>
        {/* Displaying a message indicating the screen doesn't exist */}
        <ThemedText type="title">This screen doesn't exist.</ThemedText>

        {/* Link to navigate back to the home screen */}
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

// Styles for the NotFoundScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up the full height of the screen
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
    padding: 20, // Add padding around the container
  },
  link: {
    marginTop: 15, // Add space above the link
    paddingVertical: 15, // Add vertical padding inside the link
  },
});
