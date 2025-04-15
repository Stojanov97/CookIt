import { ThemedText } from "@/components/ThemedText"; // Custom themed text component
import { ThemedView } from "@/components/ThemedView"; // Custom themed view component
import { Link, router, Stack, useLocalSearchParams } from "expo-router"; // Expo router utilities
import { useEffect, useState } from "react"; // React hooks
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"; // React Native components
import { useSession } from "../ctx"; // Custom hook for session management
import { HOST_URL } from "@/constants/Host"; // Host URL constant
import { Image } from "expo-image"; // Image component from Expo
import { useGlobal } from "@/GlobalContext"; // Global context for app-wide state
import placeholder from "@/assets/images/placeholder.jpg"; // Placeholder image for recipes without photos

const recipe = () => {
  const { session } = useSession(); // Retrieve session data
  const { checkDB, setCheckDB } = useGlobal(); // Global state for database changes
  let user: any; // User object
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session); // Parse session data if available
  }
  const { id } = useLocalSearchParams(); // Get recipe ID from URL parameters
  const [recipe, setRecipe] = useState<{
    _id: string;
    name: string;
    ingredients: string[];
    By: { id: string; name: string };
    instructions: string;
    category: string;
    photo: string | boolean;
  } | null>(null); // State for recipe data
  const [admin, setAdmin] = useState(false); // State to check if the user is the recipe owner

  useEffect(() => {
    // Fetch recipe data when component mounts or `checkDB` changes
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/${id}`) // Fetch recipe by ID
          .then((res) => res.json())
          .then((data) => {
            if (user.id === data.By.id) {
              setAdmin(true); // Set admin to true if the user owns the recipe
            } else {
              setAdmin(false); // Otherwise, set admin to false
            }
            setRecipe(data); // Store recipe data in state
          });
      } catch (error) {
        console.log(error); // Log errors to the console
      }
    })();
  }, [checkDB]); // Dependency array includes `checkDB`

  const deleteHandler = async () => {
    // Handle recipe deletion
    try {
      await fetch(`${HOST_URL}/api/v1/recipes/${id}/${user.id}`, {
        method: "DELETE", // HTTP DELETE method
        headers: {
          "Content-Type": "application/json", // Content type header
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data["success"] === true) {
            setCheckDB(!checkDB); // Trigger a re-fetch of data
            router.push("/(tabs)"); // Navigate back to the main tab
          }
        });
    } catch (err) {
      console.log(err); // Log errors to the console
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: recipe?.name }} />{" "}
      {/* Set screen title */}
      <View style={styles.container}>
        <ScrollView>
          {admin ? ( // Conditional rendering for admin (recipe owner)
            <>
              <ThemedText style={styles.text}>
                You • {recipe?.category} {/* Display category for admin */}
              </ThemedText>
              <Image
                style={styles.image}
                source={
                  recipe?.photo
                    ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}` // Recipe photo URL
                    : placeholder // Placeholder image
                }
                contentFit="cover"
                transition={300} // Smooth transition for image loading
              />
              <View
                style={{
                  marginVertical: 10,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <ThemedText style={styles.text}>Ingredients: </ThemedText>
                {recipe?.ingredients.map((item, index) => (
                  <ThemedText
                    key={index}
                    style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
                  >
                    {item}
                    {", "} {/* Display ingredients with commas */}
                  </ThemedText>
                ))}
              </View>
              <ThemedText style={styles.text}>Instructions: </ThemedText>
              <ThemedText
                style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
              >
                {" "}
                {recipe?.instructions} {/* Display recipe instructions */}
              </ThemedText>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 70,
                  alignSelf: "center",
                  justifyContent: "center",
                  marginVertical: 20,
                }}
              >
                <Pressable
                  style={{ ...styles.btn, backgroundColor: "red" }}
                  onPress={deleteHandler} // Delete button handler
                >
                  <Text
                    style={{ ...styles.text, fontWeight: 400, color: "#fff" }}
                  >
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push(`../edit?id=${recipe?._id}`); // Navigate to edit screen
                  }}
                  style={{ ...styles.btn, backgroundColor: "green" }}
                >
                  <Text
                    style={{ ...styles.text, fontWeight: 400, color: "#fff" }}
                  >
                    Edit
                  </Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <ThemedText style={styles.text}>
                {recipe?.By.name} • {recipe?.category}{" "}
                {/* Display author and category */}
              </ThemedText>
              <Image
                style={styles.image}
                source={
                  recipe?.photo
                    ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}` // Recipe photo URL
                    : placeholder // Placeholder image
                }
                contentFit="cover"
                transition={300} // Smooth transition for image loading
              />
              <View
                style={{
                  marginVertical: 10,
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <ThemedText style={styles.text}>Ingredients: </ThemedText>
                {recipe?.ingredients.map((item, index) => (
                  <ThemedText
                    key={index}
                    style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
                  >
                    {item} {/* Display ingredients */}
                  </ThemedText>
                ))}
              </View>
              <ThemedText style={styles.text}>Instructions: </ThemedText>
              <ThemedText
                style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
              >
                {" "}
                {recipe?.instructions} {/* Display recipe instructions */}
              </ThemedText>
            </>
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full height container
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 10, // Vertical padding
  },
  text: {
    fontSize: 20, // Font size for text
    fontWeight: "bold", // Bold text
    fontFamily: "SpaceMono", // Custom font
  },
  image: {
    width: 400, // Image width
    height: 240, // Image height
    margin: 6, // Margin around the image
    alignSelf: "center", // Center the image horizontally
  },
  btn: {
    width: 100, // Button width
    height: 50, // Button height
    display: "flex", // Flexbox for alignment
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    borderRadius: 10, // Rounded corners
  },
});
