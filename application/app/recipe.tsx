import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link, router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSession } from "../ctx";
import { HOST_URL } from "@/constants/Host";
import { Image } from "expo-image";
import { useGlobal } from "@/GlobalContext";
import placeholder from "@/assets/images/placeholder.jpg";

const recipe = () => {
  const { session } = useSession();
  const { checkDB, setCheckDB } = useGlobal();
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<{
    _id: string;
    name: string;
    ingredients: string[];
    By: { id: string; name: string };
    instructions: string;
    category: string;
    photo: string | boolean;
  } | null>(null);
  const [admin, setAdmin] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/${id}`)
          .then((res) => res.json())
          .then((data) => {
            if (user.id === data.By.id) {
              setAdmin(true);
            } else {
              setAdmin(false);
            }
            setRecipe(data);
          });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [checkDB]);

  const deleteHandler = async () => {
    try {
      await fetch(`${HOST_URL}/api/v1/recipes/${id}/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data["success"] === true) {
            setCheckDB(!checkDB);
            router.push("/(tabs)");
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Stack.Screen options={{ title: recipe?.name }} />
      <View style={styles.container}>
        <ScrollView>
          {admin ? (
            <>
              <ThemedText style={styles.text}>
                You • {recipe?.category}
              </ThemedText>
              <Image
                style={styles.image}
                source={
                  recipe?.photo
                    ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}`
                    : placeholder
                }
                contentFit="cover"
                transition={300}
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
                    {", "}
                  </ThemedText>
                ))}
              </View>
              <ThemedText style={styles.text}>Instructions: </ThemedText>
              <ThemedText
                style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
              >
                {" "}
                {recipe?.instructions}
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
                  onPress={deleteHandler}
                >
                  <Text
                    style={{ ...styles.text, fontWeight: 400, color: "#fff" }}
                  >
                    Delete
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    router.push(`../edit?id=${recipe?._id}`);
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
                {recipe?.By.name} • {recipe?.category}
              </ThemedText>
              <Image
                style={styles.image}
                source={
                  recipe?.photo
                    ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}`
                    : placeholder
                }
                contentFit="cover"
                transition={300}
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
                  </ThemedText>
                ))}
              </View>
              <ThemedText style={styles.text}>Instructions: </ThemedText>
              <ThemedText
                style={{ ...styles.text, fontSize: 16, fontWeight: 400 }}
              >
                {" "}
                {recipe?.instructions}
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  image: {
    width: 400,
    height: 240,
    margin: 6,
    alignSelf: "center",
  },
  btn: {
    width: 100,
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
