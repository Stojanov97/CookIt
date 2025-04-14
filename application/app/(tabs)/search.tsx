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
  const [search, setSearch] = useState<string>("");
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
  const { checkDB, setCheckDB } = useGlobal();

  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes`)
          .then((res) => res.json())
          .then((data) => {
            setItems(data);
          });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [checkDB]);

  useEffect(() => {
    setRecipes(
      items.filter((item: { name: string }) =>
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
                key={item._id}
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
                      ? `${HOST_URL}/api/v1/recipes/image/${item?._id}`
                      : placeholder
                  }
                  contentFit="cover"
                  transition={300}
                />
                <Link href={`../recipe?id=${item._id}`} style={styles.link}>
                  <ThemedText style={{ ...styles.text, color: "white" }}>
                    {item.name}
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
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "#0553",
  },
  link: {
    width: "100%",
    height: "100%",
    padding: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
