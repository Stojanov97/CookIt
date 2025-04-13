import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";
import placeholder from "@/assets/images/placeholder.jpg";
let uri = "";

interface ImageUploadProps {
  show(): any;
  uri: string | undefined;
}

const ImageUpload = ({ show, uri }: ImageUploadProps) => {
  return (
    <>
      <TouchableOpacity onPress={() => show()}>
        <Image source={uri ? { uri } : placeholder} style={styles.image} />
      </TouchableOpacity>
    </>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 240,
    borderRadius: 10,
    backgroundColor: "#0553",
  },
});
