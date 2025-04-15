import { StyleSheet, TextInput, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HOST_URL } from "@/constants/Host";
import { useGlobal } from "@/GlobalContext";
import { Image } from "expo-image";
import placeholder from "@/assets/images/placeholder.jpg";

const search = () => {
  // State to store the search input value
  const [search, setSearch] = useState<string>("");

  // State to store filtered recipes based on the search input
  const [recipes, setRecipes] = useState<
    {
      name: string;
      _id: string;
      ingredients: string[];
      instructions: string;
      category: string;
      photo: string | boolean;
    }[]
  >([]);

  // State to store all fetched recipes
  const [items, setItems] = useState<
    {
      name: string;
      _id: string;
      ingredients: string[];
      instructions: string;
      category: string;
      photo: string | boolean;
    }[]
  >([]);

  // Global context for database check
  const { checkDB, setCheckDB } = useGlobal();

  // Fetch recipes from the API when the component mounts or `checkDB` changes
  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes`)
          .then((res) => res.json())
          .then((data) => {
            setItems(data); // Store fetched recipes in `items`
          });
      } catch (error) {
        console.log(error); // Log any errors during the fetch
      }
    })();
  }, [checkDB]);

  // Filter recipes based on the search input
  useEffect(() => {
    setRecipes(
      items.filter((item: { name: string }) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  return (
    <View style={styles.container}>
      {/* Search input container with shadow styling */}
      <ThemedView
        style={{
          ...styles.input,
          boxShadow:
            " rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
        }}
      >
        {/* Search icon */}
        <Ionicons name={"search"} color="black" size={20} />
        {/* Search input field */}
        <TextInput
          placeholder="Search"
          style={{ outline: "none", width: 260, color: "black" }}
          value={search}
          placeholderTextColor={"black"}
          onChange={(e) => setSearch(e.nativeEvent.text)} // Update search state on input change
        ></TextInput>
      </ThemedView>

      {/* Display message or search results */}
      {search.length < 1 ? (
        // Message when no search input is provided
        <ThemedText style={styles.text}>
          Search for your favorite meal!
        </ThemedText>
      ) : (
        <ScrollView>
          {/* Message when no results are found */}
          {recipes.length < 1 ? (
            <ThemedText style={styles.text}>No results</ThemedText>
          ) : (
            // Render filtered recipes
            recipes.map((item) => (
              <ThemedView
                key={item._id}
                style={{
                  width: 320,
                  height: 140,
                  margin: 6,
                  position: "relative",
                }}
              >
                {/* Recipe image */}
                <Image
                  style={styles.image}
                  source={
                    item?.photo
                      ? `${HOST_URL}/api/v1/recipes/image/${item?._id}` // Use recipe photo if available
                      : placeholder // Use placeholder image if no photo
                  }
                  contentFit="cover"
                  transition={300}
                />
                {/* Link to recipe details */}
                <Link href={`../recipe?id=${item._id}`} style={styles.link}>
                  <ThemedText style={{ ...styles.text, color: "white" }}>
                    {item.name} {/* Recipe name */}
                  </ThemedText>
                </Link>
              </ThemedView>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", // Center content horizontally
  },
  text: {
    fontFamily: "SpaceMono", // Custom font for text
  },
  input: {
    width: 320,
    height: 40,
    backgroundColor: "white", // White background for input
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 15, // Horizontal padding
    margin: 10, // Margin around the input
    display: "flex",
    flexDirection: "row", // Align items in a row
    gap: 10, // Space between children
    alignItems: "center", // Center items vertically
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%", // Full width
    backgroundColor: "#0553", // Fallback background color
  },
  link: {
    width: "100%",
    height: "100%",
    padding: 15, // Padding inside the link
    display: "flex",
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    textAlign: "center", // Center text
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
});
