import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import Textarea from "react-native-textarea";
import { Picker } from "@react-native-picker/picker";
import ImageUpload from "@/components/ImageUpload";
import * as ImagePicker from "expo-image-picker";
import ImageUploadOptions from "@/components/ImageUploadOptions";
import { HOST_URL } from "@/constants/Host";
import { useSession } from "@/ctx";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useGlobal } from "@/GlobalContext";

const edit = () => {
  const router = useRouter(); // Router for navigation
  const { session } = useSession(); // Get user session
  const { checkDB, setCheckDB } = useGlobal(); // Global state for database check
  const { id } = useLocalSearchParams(); // Get recipe ID from route params
  const colorScheme = useColorScheme(); // Detect light/dark mode
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session); // Parse session data if available
  }

  // State variables for form fields and image
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch recipe details on component mount
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/${id}`)
          .then((res) => res.json())
          .then((data) => {
            // Populate form fields with fetched data
            setName(data.name);
            setCategory(data.category);
            setIngredients(data.ingredients.join(", "));
            setInstructions(data.instructions);
            if (data.photo) {
              setImage(`${HOST_URL}/api/v1/recipes/image/${data._id}`);
            } else {
              setImage(undefined);
            }
          });
      } catch (error) {
        console.log(error); // Log errors
      }
    })();
  }, []);

  const uploadImage = async (mode: string | undefined) => {
    // Handle image upload from gallery or camera
    try {
      let result;
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request gallery permissions
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true, // Allow image editing
          aspect: [4, 3], // Set aspect ratio
          quality: 0.8, // Set image quality
        });
      } else {
        await ImagePicker.requestCameraPermissionsAsync(); // Request camera permissions
        result = await ImagePicker.launchCameraAsync({
          cameraType: ImagePicker.CameraType.back,
          allowsEditing: true, // Allow image editing
          aspect: [4, 3], // Set aspect ratio
          quality: 0.8, // Set image quality
        });
      }
      if (!result.canceled) {
        console.log(result); // Log image result
        saveImage(result.assets[0].uri); // Save image URI
      }
    } catch (error) {
      console.log(error); // Log errors
      setShowOptions(false); // Hide image options
    }
  };

  const saveImage = async (image: any) => {
    // Save selected image
    try {
      setImage(image);
      setShowOptions(false); // Hide image options
    } catch (error) {
      console.log(error); // Log errors
    }
  };

  const editHandler = async () => {
    // Handle recipe edit submission
    try {
      let data = new FormData();
      if (
        name == "" ||
        ingredients == "" ||
        instructions == "" ||
        category == ""
      ) {
        return alert("Please fill all the fields!"); // Validate form fields
      } else {
        // Append form data
        data.append("name", name);
        data.append("ingredients", JSON.stringify(ingredients.split(", ")));
        data.append("instructions", instructions);
        data.append("category", category);
        data.append("userID", user.id);
        data.append("userName", user.name);
        if (image !== undefined) {
          let file: any = {
            uri: image,
            name: image?.split("/").pop(),
            type: `image/${image?.split(".").pop()}`,
          };
          data.append("photo", file); // Append image file
        }
        console.log(`${HOST_URL}/api/v1/recipes/${id}/${user.id}`);
        await fetch(`${HOST_URL}/api/v1/recipes/${id}/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data); // Log response
            if (data["success"] === true) {
              // Reset form fields on success
              setName("");
              setCategory("");
              setImage(undefined);
              setIngredients("");
              setCheckDB(!checkDB); // Trigger global state update
              router.back(); // Navigate back
            }
          });
      }
    } catch (error) {
      console.log(error); // Log errors
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: `Edit ${name}` }} />{" "}
      {/* Set screen title */}
      <View style={styles.container}>
        {showOptions && (
          <ImageUploadOptions
            upload={uploadImage} // Pass upload handler
            hide={() => setShowOptions(false)} // Hide options
            remove={() => saveImage(null)} // Remove image
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
            value={name} // Bind name state
            onChange={(e) => setName(e.nativeEvent.text)} // Update name state
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
              selectedValue={category} // Bind category state
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)} // Update category state
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
            value={ingredients} // Bind ingredients state
            onChange={(e: any) => setIngredients(e.nativeEvent.text)} // Update ingredients state
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
            value={instructions} // Bind instructions state
            onChange={(e: any) => setInstructions(e.nativeEvent.text)} // Update instructions state
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
            onPress={() => editHandler()} // Trigger edit handler
          >
            <ThemedText
              style={{
                ...styles.text,
                fontWeight: 900,
                fontSize: 22,
                textAlign: "center",
              }}
            >
              Edit
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  );
};

export default edit;

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
