import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { StyleSheet, Pressable, ScrollView, View } from "react-native";

const myRecipes: { id: string; name: string }[] = [
  // { id: "iausgdf1", name: "curry chicken" },
  // { id: "iausgdf2", name: "pesto pasta" },
  // { id: "iausgdf3", name: "pizza" },
  // { id: "iausgdf4", name: "Pancakes" },
  // { id: "iausgdf12", name: "parmesan" },
  // { id: "iausgdf22", name: "pastramajlija" },
  // { id: "iausgdf32", name: "pita" },
  // { id: "iausgdf42", name: "burek" },
  // { id: "iausgdf13", name: "kebab" },
  // { id: "iausgdf23", name: "chicken wings" },
  // { id: "iausgdf33", name: "pizza Burger" },
  // { id: "iausgdf43", name: "Chicken burger" },
];

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      {myRecipes.length < 1 ? (
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            <ThemedText
              style={{ ...styles.text, fontWeight: 900, fontSize: 22 }}
            >
              Add
            </ThemedText>
          </Link>
        </>
      ) : (
        <>
          <ThemedText style={styles.text}>
            Number of recipes: {myRecipes.length}
          </ThemedText>
          <ScrollView>
            {myRecipes.map((recipe) => (
              <ThemedView key={recipe.id} style={styles.card}>
                <ThemedText key={recipe.id} style={styles.text}>
                  {recipe.name}
                </ThemedText>
              </ThemedView>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    margin: 10,
    fontFamily: "SpaceMono",
  },
  add: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "orange",
    alignSelf: "flex-end",
    margin: 15,
    zIndex: 100,
    bottom: -5,
    right: -5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: { height: 100, width: 330, backgroundColor: "blue", margin: 10 },
});
