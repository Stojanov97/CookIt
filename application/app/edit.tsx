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
  const router = useRouter();
  const { session } = useSession();
  const { checkDB, setCheckDB } = useGlobal();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }
  const [category, setCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [ingredients, setIngredients] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        await fetch(`${HOST_URL}/api/v1/recipes/${id}`)
          .then((res) => res.json())
          .then((data) => {
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
        console.log(error);
      }
    })();
  }, []);

  const uploadImage = async (mode: string | undefined) => {
    try {
      let result;
      if (mode === "gallery") {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
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
        saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      setShowOptions(false);
    }
  };
  const saveImage = async (image: any) => {
    try {
      setImage(image);
      setShowOptions(false);
    } catch (error) {
      console.log(error);
    }
  };
  const editHandler = async () => {
    try {
      let data = new FormData();
      if (
        name == "" ||
        ingredients == "" ||
        instructions == "" ||
        category == ""
      ) {
        return alert("Please fill all the fields!");
      } else {
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
          data.append("photo", file);
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
            console.log(data);
            if (data["success"] === true) {
              setName("");
              setCategory("");
              setImage(undefined);
              setIngredients("");
              setCheckDB(!checkDB);
              router.back();
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Stack.Screen options={{ title: `Edit ${name}` }} />
      <View style={styles.container}>
        {showOptions && (
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
            onChange={(e) => setName(e.nativeEvent.text)}
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
              onValueChange={(itemValue, itemIndex) => setCategory(itemValue)}
            >
              <Picker.Item label="--Select Category--" value="" />
              <Picker.Item label="Main Dish" value="main-dish" />
              <Picker.Item label="Side Dish" value="side-dish" />
              <Picker.Item label="Desert" value="desert" />
            </Picker>
          </View>
          <ThemedText style={styles.text2}>Upload a photo:</ThemedText>
          <ImageUpload show={() => setShowOptions(true)} uri={image} />

          <ThemedText style={styles.text2}>Ingredients:</ThemedText>
          <Textarea
            value={ingredients}
            onChange={(e: any) => setIngredients(e.nativeEvent.text)}
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
            onChange={(e: any) => setInstructions(e.nativeEvent.text)}
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
            onPress={() => editHandler()}
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
