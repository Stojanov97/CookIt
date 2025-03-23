import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const recipe = () => {
  const { id } = useLocalSearchParams();
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Meal {id}</ThemedText>
    </ThemedView>
  );
};

export default recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#25292e",
    alignItems: "center",
  },
});
