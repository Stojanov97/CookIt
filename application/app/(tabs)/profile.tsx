import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { StyleSheet, ScrollView, View } from "react-native";
import { useSession } from "../../ctx";
import { HOST_URL } from "@/constants/Host";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import placeholder from "@/assets/images/placeholder.jpg";

export default function AboutScreen() {
  const { session, signOut } = useSession();
  const [recipes, setRecipes] = useState<
    { _id: string; name: string; photo: string | boolean }[]
  >([]);
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }
  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/length/${user.id}`)
          .then((res) => res.json())
          .then((data) => setRecipes(data));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [session]);
  return (
    <View style={styles.container}>
      {recipes.length < 1 ? (
        <>
          <ThemedText style={styles.text}>
            No recipes yet. Try adding one!
          </ThemedText>
          <Link
            href="/(tabs)/add"
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
              Add
            </ThemedText>
          </Link>
        </>
      ) : (
        <>
          <ThemedText style={styles.text}>
            Number of recipes: {recipes.length}
          </ThemedText>
          <ScrollView>
            {recipes.map((recipe) => (
              <ThemedView
                key={recipe._id}
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
                      ? `${HOST_URL}/api/v1/recipes/image/${recipe?._id}`
                      : placeholder
                  }
                  contentFit="cover"
                  transition={300}
                />
                <Link href={`../recipe?id=${recipe._id}`} style={styles.link}>
                  <ThemedText style={styles.text2}>{recipe.name}</ThemedText>
                </Link>
              </ThemedView>
            ))}
          </ScrollView>
        </>
      )}
      <ThemedText
        onPress={() => {
          signOut();
        }}
      >
        Sign Out
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text2: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
    color: "#fff",
    textTransform: "uppercase",
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
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    backgroundColor: "#0553",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    fontFamily: "SpaceMono",
  },
  card: { height: 100, width: 330, backgroundColor: "blue", margin: 10 },
});
