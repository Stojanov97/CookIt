import { StyleSheet, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { HOST_URL } from "@/constants/Host";
import { useGlobal } from "@/GlobalContext";
import placeholder from "@/assets/images/placeholder.jpg";

export default function HomeScreen() {
  const { checkDB, setCheckDB } = useGlobal(); // Access global context for database check state
  const [items, setItems] = useState<
    { _id: string; name: string; photo: string | boolean }[]
  >([]); // State to store fetched recipe items

  useEffect(() => {
    // Fetch recipes from the API whenever `checkDB` changes
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes`)
          .then((res) => res.json())
          .then((data) => {
            setItems(data); // Update state with fetched data
          });
      } catch (error) {
        console.log(error); // Log any errors during fetch
      }
    })();
  }, [checkDB]); // Dependency array ensures effect runs when `checkDB` changes

  return (
    <View style={styles.container}>
      {items.length === 0 ? ( // Show loading text if no items are available
        <ThemedText style={styles.text}>Loading...</ThemedText>
      ) : (
        <ScrollView>
          {items.map((item) => (
            <ThemedView
              key={item._id} // Unique key for each item
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
                  item?.photo
                    ? `${HOST_URL}/api/v1/recipes/image/${item?._id}` // Use item photo if available
                    : placeholder // Fallback to placeholder image
                }
                contentFit="cover"
                transition={300} // Smooth image transition
              />
              <Link href={`../recipe?id=${item._id}`} style={styles.link}>
                <ThemedText style={{ ...styles.text, color: "white" }}>
                  {item.name} {/* Display recipe name */}
                </ThemedText>
              </Link>
            </ThemedView>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Full screen height
    alignItems: "center", // Center content horizontally
  },
  text: {
    fontSize: 20, // Font size for text
    fontWeight: "bold", // Bold text
    fontFamily: "SpaceMono", // Custom font
    textTransform: "uppercase", // Uppercase text
  },
  link: {
    width: "100%", // Full width of parent
    height: "100%", // Full height of parent
    padding: 15, // Padding inside the link
    display: "flex", // Flexbox layout
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    textAlign: "center", // Center text alignment
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  image: {
    position: "absolute", // Position image absolutely within parent
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%", // Full width of parent
    backgroundColor: "#0553", // Placeholder background color
  },
});
