import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";

interface props {
  upload: (mode: string | undefined) => void;
  hide: () => void;
  remove: () => void;
}

export default function ImageUploadOptions({ upload, hide, remove }: props) {
  return (
    <TouchableOpacity
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onPress={() => hide()}
    >
      <ThemedView
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 50,
          width: "90%",
          height: 100,
          borderRadius: 10,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: 600,
            height: 30,
          }}
          onPress={() => upload("camera")}
        >
          Camera
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: 600,
            height: 30,
          }}
          onPress={() => upload("gallery")}
        >
          Gallery
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: 600,
            height: 30,
          }}
          onPress={() => {
            remove();
            hide();
          }}
        >
          Remove
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});
