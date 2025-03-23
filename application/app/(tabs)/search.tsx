import { StyleSheet, TextInput, ScrollView, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const items = [
  { id: "iausgdf1", name: "curry chicken" },
  { id: "iausgdf2", name: "pesto pasta" },
  { id: "iausgdf3", name: "pizza" },
  { id: "iausgdf4", name: "Pancakes" },
  { id: "iausgdf12", name: "parmesan" },
  { id: "iausgdf22", name: "pastramajlija" },
  { id: "iausgdf32", name: "pita" },
  { id: "iausgdf42", name: "burek" },
  { id: "iausgdf13", name: "kebab" },
  { id: "iausgdf23", name: "chicken wings" },
  { id: "iausgdf33", name: "pizza Burger" },
  { id: "iausgdf43", name: "Chicken burger" },
];

const search = () => {
  const [search, setSearch] = useState<string>("");
  const [recipes, setRecipes] = useState(items);
  useEffect(() => {
    setRecipes(
      items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);
  return (
    <View style={styles.container}>
      <ThemedView
        style={{
          ...styles.input,
          boxShadow:
            " rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px",
        }}
      >
        <Ionicons name={"search"} color="black" size={20} />
        <TextInput
          placeholder="Search"
          style={{ outline: "none", width: 260, color: "black" }}
          value={search}
          placeholderTextColor={"black"}
          onChange={(e) => setSearch(e.nativeEvent.text)}
        ></TextInput>
      </ThemedView>
      {search.length < 1 ? (
        <ThemedText style={styles.text}>
          Search for your favorite meal!
        </ThemedText>
      ) : (
        <ScrollView>
          {recipes.length < 1 ? (
            <ThemedText style={styles.text}>No results</ThemedText>
          ) : (
            recipes.map((item) => (
              <ThemedView
                key={item.id}
                style={{
                  width: 320,
                  height: 140,
                  backgroundColor: "blue",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 6,
                }}
              >
                <Link href={`/recipe?id=${item.id}`}>Link</Link>
                <ThemedText style={styles.text}>{item.name}</ThemedText>
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
    alignItems: "center",
  },
  text: {
    fontFamily: "SpaceMono",
  },
  input: {
    width: 320,
    height: 40,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    margin: 10,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
});
