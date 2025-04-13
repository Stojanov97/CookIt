import {
  StyleSheet,
  Platform,
  ScrollViewComponent,
  ScrollView,
  View,
} from "react-native";
import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { HOST_URL } from "@/constants/Host";

import { useSession } from "../../ctx";

export default function HomeScreen() {
  const { signOut } = useSession();
  const [items, setItems] = useState<
    { _id: string; name: string; photo: { dest: string } }[]
  >([]);
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
  }, []);
  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <ThemedText style={styles.text}>Loading...</ThemedText>
      ) : (
        <ScrollView>
          {items.map((item) => (
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
                source={`${HOST_URL}/api/v1/recipes/image/${item._id}`}
                contentFit="cover"
                transition={300}
              />
              <Link href={`../recipe?id=${item._id}`} style={styles.link}>
                <ThemedText style={{ ...styles.text, color: "white" }}>
                  {item.name}
                </ThemedText>
              </Link>
            </ThemedView>
          ))}
        </ScrollView>
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
  text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
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
});
