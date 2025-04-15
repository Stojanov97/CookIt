import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

// Define the props interface for the component
interface props {
  upload: (mode: string | undefined) => void; // Function to handle image upload (camera or gallery)
  hide: () => void; // Function to hide the modal
  remove: () => void; // Function to remove the image
}

// Main component for displaying image upload options
export default function ImageUploadOptions({ upload, hide, remove }: props) {
  return (
    // Full-screen overlay with semi-transparent background
    <TouchableOpacity
      style={{
        position: "absolute", // Position the overlay absolutely
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent black background
        justifyContent: "center", // Center content vertically
        alignItems: "center", // Center content horizontally
        zIndex: 1000, // Ensure the overlay is on top
      }}
      onPress={() => hide()} // Hide the modal when the overlay is pressed
    >
      {/* Container for the upload options */}
      <ThemedView
        style={{
          display: "flex", // Flexbox layout
          flexDirection: "row", // Arrange children in a row
          gap: 50, // Space between options
          width: "90%", // Width of the container
          height: 100, // Height of the container
          borderRadius: 10, // Rounded corners
          justifyContent: "center", // Center options horizontally
          alignItems: "center", // Center options vertically
        }}
      >
        {/* Option to upload from the camera */}
        <ThemedText
          style={{
            fontSize: 18, // Font size for the text
            fontWeight: 600, // Bold font weight
            height: 30, // Height of the text container
          }}
          onPress={() => upload("camera")} // Trigger upload with "camera" mode
        >
          Camera
        </ThemedText>

        {/* Option to upload from the gallery */}
        <ThemedText
          style={{
            fontSize: 18, // Font size for the text
            fontWeight: 600, // Bold font weight
            height: 30, // Height of the text container
          }}
          onPress={() => upload("gallery")} // Trigger upload with "gallery" mode
        >
          Gallery
        </ThemedText>

        {/* Option to remove the image */}
        <ThemedText
          style={{
            fontSize: 18, // Font size for the text
            fontWeight: 600, // Bold font weight
            height: 30, // Height of the text container
          }}
          onPress={() => {
            remove(); // Remove the image
            hide(); // Hide the modal
          }}
        >
          Remove
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

// Empty styles object (can be used for future styling)
const styles = StyleSheet.create({});
