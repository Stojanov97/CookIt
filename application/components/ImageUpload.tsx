import { StyleSheet, Text, TouchableOpacity } from "react-native"; // Importing necessary components from React Native
import React from "react";
import { Image } from "expo-image"; // Importing Image component from expo-image for better performance
import placeholder from "@/assets/images/placeholder.jpg"; // Importing a placeholder image

// Defining the props interface for the ImageUpload component
interface ImageUploadProps {
  show(): any; // Function to handle the image upload action
  uri: string | undefined; // URI of the image to display, can be undefined
}

// Functional component to handle image upload and display
const ImageUpload = ({ show, uri }: ImageUploadProps) => {
  return (
    <>
      {/* TouchableOpacity to make the image clickable */}
      <TouchableOpacity onPress={() => show()}>
        {/* Display the image, fallback to placeholder if uri is undefined */}
        <Image
          source={uri != undefined ? { uri } : placeholder}
          style={styles.image} // Applying styles to the image
        />
      </TouchableOpacity>
    </>
  );
};

export default ImageUpload; // Exporting the component for use in other parts of the app

// Styles for the component
const styles = StyleSheet.create({
  image: {
    width: "100%", // Full width of the parent container
    height: 240, // Fixed height for the image
    borderRadius: 10, // Rounded corners for the image
    backgroundColor: "#0553", // Fallback background color
  },
});
