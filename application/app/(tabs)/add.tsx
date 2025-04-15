import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import Textarea from "react-native-textarea";
import { Picker } from "@react-native-picker/picker";
import ImageUpload from "@/components/ImageUpload";
import * as ImagePicker from "expo-image-picker";
import ImageUploadOptions from "@/components/ImageUploadOptions";
import { HOST_URL } from "@/constants/Host";
import { useSession } from "@/ctx";
import { useRouter } from "expo-router";
import { useGlobal } from "@/GlobalContext";

const add = () => {
  const router = useRouter(); // Router for navigation
  const { session } = useSession(); // Get user session
  const { checkDB, setCheckDB } = useGlobal(); // Global state for database check
  console.log(checkDB);
  const colorScheme = useColorScheme(); // Detect light/dark mode
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session); // Parse session to get user data
  }
  const [category, setCategory] = useState<string>(""); // State for recipe category
  const [name, setName] = useState<string>(""); // State for recipe name
  const [ingredients, setIngredients] = useState<string>(""); // State for ingredients
  const [instructions, setInstructions] = useState<string>(""); // State for instructions
  const [showOptions, setShowOptions] = useState<boolean>(false); // State for image upload options visibility
  const [image, setImage] = useState<string | undefined>(undefined); // State for uploaded image

  const uploadImage = async (mode: string | undefined) => {
    // Function to handle image upload (camera/gallery)
    try {
      let result;
      if (mode === "gallery") {
        // Request gallery permissions and open gallery
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        // Request camera permissions and open camera
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }
      if (!result.canceled) {
        console.log(result);
        saveImage(result.assets[0].uri); // Save image URI
      }
    } catch (error) {
      console.log(error);
      setShowOptions(false); // Hide options on error
    }
  };

  const saveImage = async (image: any) => {
    // Save image URI to state
    try {
      setImage(image);
      setShowOptions(false); // Hide options after saving
    } catch (error) {
      console.log(error);
    }
  };

  const addHandler = async () => {
    // Function to handle adding a new recipe
    try {
      let data = new FormData();
      if (
        name == "" ||
        ingredients == "" ||
        instructions == "" ||
        category == ""
      ) {
        return alert("Please fill all the fields!"); // Validate input fields
      } else {
        // Append form data
        data.append("name", name);
        data.append("ingredients", JSON.stringify(ingredients.split(", "))); // Convert ingredients to array
        data.append("instructions", instructions);
        data.append("category", category);
        data.append("userID", user.id); // Add user ID
        data.append("userName", user.name); // Add user name
        if (image !== undefined) {
          // Add image if available
          let file: any = {
            uri: image,
            name: image?.split("/").pop(),
            type: `image/${image?.split(".").pop()}`,
          };
          data.append("photo", file);
        }
        // Send POST request to server
        await fetch(`${HOST_URL}/api/v1/recipes`, {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            if (data["success"] === true) {
              // Reset form and navigate back on success
              setName("");
              setCategory("");
              setImage(undefined);
              setIngredients("");
              setCheckDB(!checkDB); // Trigger global state update
              router.push("/(tabs)");
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {showOptions && (
        // Show image upload options if enabled
        <ImageUploadOptions
          upload={uploadImage}
          hide={() => setShowOptions(false)}
          remove={() => saveImage(null)}
        />
      )}
      <ScrollView>
        <ThemedText style={styles.text}>Add your new recipe</ThemedText>
        <ThemedText style={styles.text2}>Recipe Name:</ThemedText>
        <TextInput
          style={
            colorScheme == "dark"
              ? { ...styles.input, color: "white" }
              : styles.input
          }
          placeholderTextColor={colorScheme == "dark" ? "#bfbfbf" : "#000"}
          value={name}
          onChange={(e) => setName(e.nativeEvent.text)} // Update recipe name
          placeholder="Enter the name of the recipe"
        />
        <ThemedText style={styles.text2}>Select a category:</ThemedText>
        <View style={{ ...styles.input, margin: 0, paddingBlock: 0 }}>
          <Picker
            style={
              colorScheme == "dark"
                ? { padding: 0, margin: 0, color: "#bfbfbf" }
                : { padding: 0, margin: 0 }
            }
            selectedValue={category}
            onValueChange={(itemValue, itemIndex) => setCategory(itemValue)} // Update category
          >
            <Picker.Item label="--Select Category--" value="" />
            <Picker.Item label="Main Dish" value="main-dish" />
            <Picker.Item label="Side Dish" value="side-dish" />
            <Picker.Item label="Desert" value="desert" />
          </Picker>
        </View>
        <ThemedText style={styles.text2}>Upload a photo:</ThemedText>
        <ImageUpload show={() => setShowOptions(true)} uri={image} />{" "}
        {/* Image upload component */}
        <ThemedText style={styles.text2}>Ingredients:</ThemedText>
        <Textarea
          value={ingredients}
          onChange={(e: any) => setIngredients(e.nativeEvent.text)} // Update ingredients
          containerStyle={{ ...styles.textareaContainer, height: 100 }}
          style={
            colorScheme == "dark"
              ? { ...styles.textarea1, height: 90, color: "white" }
              : styles.textarea1
          }
          placeholderTextColor={colorScheme == "dark" ? "#bfbfbf" : "#000"}
          maxLength={240}
          placeholder={"Enter the ingredients needed, use (, ) to separate"}
          underlineColorAndroid={"transparent"}
        />
        <ThemedText style={styles.text2}>Instructions:</ThemedText>
        <Textarea
          value={instructions}
          onChange={(e: any) => setInstructions(e.nativeEvent.text)} // Update instructions
          containerStyle={styles.textareaContainer}
          style={
            colorScheme == "dark"
              ? { ...styles.textarea1, color: "white" }
              : styles.textarea1
          }
          placeholderTextColor={colorScheme == "dark" ? "#bfbfbf" : "#000"}
          maxLength={1000}
          placeholder={"Enter your instructions here"}
          underlineColorAndroid={"transparent"}
        />
        <TouchableOpacity
          style={{
            ...styles.text,
            width: 150,
            height: 60,
            borderRadius: 5,
            backgroundColor: "orange",
            alignSelf: "center",
            margin: 15,
            boxSizing: "border-box",
            padding: 17,
          }}
          onPress={() => addHandler()} // Trigger addHandler on button press
        >
          <ThemedText
            style={{
              ...styles.text,
              fontWeight: 900,
              fontSize: 22,
              textAlign: "center",
            }}
          >
            Add
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default add;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    padding: 10,
    width: "100%",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "SpaceMono",
  },
  text2: {
    fontSize: 18,
    fontWeight: 600,
    marginVertical: 10,
    fontFamily: "SpaceMono",
  },
  textareaContainer: {
    height: 180,
    borderWidth: 1,
    padding: 10,
  },
  textarea1: {
    textAlignVertical: "top", // hack android
    height: 170,
    fontSize: 14,
    color: "#333",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    backgroundColor: "#0553",
  },
});
