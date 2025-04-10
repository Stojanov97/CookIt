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

const items = [
  { _id: "iausgdf1", name: "test1" },
  { _id: "iausgdf2", name: "test2" },
  { _id: "iausgdf3", name: "test3" },
  { _id: "iausgdf4", name: "test4" },
  { _id: "iausgdf12", name: "test1" },
  { _id: "iausgdf22", name: "test2" },
  { _id: "iausgdf32", name: "test3" },
  { _id: "iausgdf42", name: "test4" },
  { _id: "iausgdf13", name: "test1" },
  { _id: "iausgdf23", name: "test2" },
  { _id: "iausgdf33", name: "test3" },
  { _id: "iausgdf43", name: "test4" },
];
const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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
            // console.log(data);
          });
        // await fetch(`${HOST_URL}/api/v1/recipes/image/67e08e017fbf428078608c09`)
        //   .then((data) => data.blob())
        //   .then((data) => console.log(data));
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
                // backgroundColor: "blue",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                // backgroundBlendMode: "darken",
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <Image
                style={styles.image}
                source={`${HOST_URL}/api/v1/recipes/image/${item._id}`}
                placeholder={{ blurhash }}
                contentFit="cover"
                // transition={1000}
              />
              <Link href={`./recipe?id=${item._id}`} style={styles.link}>
                <ThemedText style={styles.text}>{item.name}</ThemedText>
              </Link>
            </ThemedView>
          ))}
        </ScrollView>
      )}
      <ThemedText
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
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
});
