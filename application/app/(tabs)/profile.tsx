import { ThemedText } from "@/components/ThemedText"; // Custom themed text component
import { ThemedView } from "@/components/ThemedView"; // Custom themed view component
import { Link } from "expo-router"; // Navigation link component
import { StyleSheet, ScrollView, View } from "react-native"; // React Native components
import { useSession } from "../../ctx"; // Custom hook for session management
import { HOST_URL } from "@/constants/Host"; // Base URL for API requests
import { useEffect, useState } from "react"; // React hooks
import { Image } from "expo-image"; // Image component from expo-image
import placeholder from "@/assets/images/placeholder.jpg"; // Placeholder image for recipes without photos

export default function AboutScreen() {
  const { session, signOut } = useSession(); // Access session and signOut function from context
  const [recipes, setRecipes] = useState<
    // State to store recipes
    { _id: string; name: string; photo: string | boolean }[]
  >([]);
  let user: any; // Variable to store parsed user data

  // Parse session data if available
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }

  // Fetch recipes for the logged-in user
  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/length/${user.id}`) // API call to fetch recipes
          .then((res) => res.json()) // Parse response as JSON
          .then((data) => setRecipes(data)); // Update recipes state
      } catch (error) {
        console.log(error); // Log any errors
      }
    })();
  }, [session]); // Dependency array ensures this runs when session changes

  return (
    <View style={styles.container}>
      {recipes.length < 1 ? ( // Check if there are no recipes
        <>
          <ThemedText style={styles.text}>
            No recipes yet. Try adding one! {/* Message for no recipes */}
          </ThemedText>
          <Link
            href="/(tabs)/add" // Link to add a new recipe
            style={{
              ...styles.text,
              width: 150,
              height: 60,
              borderRadius: 5,
              backgroundColor: "orange",
              alignSelf: "center",
              margin: 15,
              textAlign: "center",
              boxSizing: "border-box",
              padding: 17,
            }}
          >
            <ThemedText
              style={{
                ...styles.text,
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              Add {/* Button text */}
            </ThemedText>
          </Link>
        </>
      ) : (
        <>
          <ThemedText style={styles.text}>
            Number of recipes: {recipes.length}{" "}
            {/* Display number of recipes */}
          </ThemedText>
          <ScrollView>
            {recipes.map(
              (
                recipe // Map through recipes to display each
              ) => (
                <ThemedView
                  key={recipe._id} // Unique key for each recipe
                  style={{
                    width: 320,
                    height: 140,
                    margin: 6,
                    position: "relative",
                  }}
                >
                  <Image
                    style={styles.image}
                    source={
                      recipe?.photo
                        ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}` // Recipe image URL
                        : placeholder // Fallback to placeholder image
                    }
                    contentFit="cover"
                    transition={300} // Smooth transition for image loading
                  />
                  <Link href={`../recipe?id=${recipe._id}`} style={styles.link}>
                    <ThemedText style={styles.text2}>{recipe.name}</ThemedText>{" "}
                    {/* Recipe name */}
                  </Link>
                </ThemedView>
              )
            )}
          </ScrollView>
        </>
      )}
      <ThemedText
        onPress={() => {
          signOut(); // Sign out the user
        }}
      >
        Sign Out {/* Sign out button */}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full height
    alignItems: "center", // Center content horizontally
  },
  text2: {
    fontSize: 20, // Font size for recipe name
    fontWeight: "bold", // Bold text
    fontFamily: "SpaceMono", // Custom font
    color: "#fff", // White text color
    textTransform: "uppercase", // Uppercase text
  },
  link: {
    width: "100%", // Full width
    height: "100%", // Full height
    padding: 15, // Padding inside the link
    display: "flex", // Flexbox layout
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    textAlign: "center", // Center text
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  image: {
    position: "absolute", // Absolute positioning
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%", // Full width
    backgroundColor: "#0553", // Fallback background color
  },
  text: {
    fontSize: 18, // Font size for general text
    textAlign: "center", // Center align text
    margin: 10, // Margin around text
    fontFamily: "SpaceMono", // Custom font
  },
  card: {
    height: 100, // Card height
    width: 330, // Card width
    backgroundColor: "blue", // Card background color
    margin: 10, // Margin around card
  },
});
