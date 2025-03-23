import {
  Image,
  StyleSheet,
  Platform,
  ScrollViewComponent,
  ScrollView,
  View,
} from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";

const items = [
  { id: "iausgdf1", name: "test1" },
  { id: "iausgdf2", name: "test2" },
  { id: "iausgdf3", name: "test3" },
  { id: "iausgdf4", name: "test4" },
  { id: "iausgdf12", name: "test1" },
  { id: "iausgdf22", name: "test2" },
  { id: "iausgdf32", name: "test3" },
  { id: "iausgdf42", name: "test4" },
  { id: "iausgdf13", name: "test1" },
  { id: "iausgdf23", name: "test2" },
  { id: "iausgdf33", name: "test3" },
  { id: "iausgdf43", name: "test4" },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView>
        {items.map((item) => (
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
        ))}
      </ScrollView>
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
  },
});
