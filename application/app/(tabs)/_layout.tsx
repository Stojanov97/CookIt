import { Tabs } from "expo-router"; // Importing Tabs component from expo-router for navigation
import React from "react"; // Importing React
import { Platform } from "react-native"; // Importing Platform to handle platform-specific styles
import Ionicons from "@expo/vector-icons/Ionicons"; // Importing Ionicons for tab bar icons

import { HapticTab } from "@/components/HapticTab"; // Custom tab bar button with haptic feedback
import TabBarBackground from "@/components/ui/TabBarBackground"; // Custom background for the tab bar
import { Colors } from "@/constants/Colors"; // Color constants for light and dark themes
import { useColorScheme } from "@/hooks/useColorScheme"; // Hook to detect the current color scheme
import { Text } from "react-native"; // Text component for rendering text
import { Redirect } from "expo-router"; // Redirect component for navigation

import { useSession } from "../../ctx"; // Custom hook to manage user session

export default function AppLayout() {
  const colorScheme = useColorScheme(); // Get the current color scheme (light or dark)
  const { session, isLoading } = useSession(); // Get session data and loading state from the custom hook
  let user: any; // Variable to store user data

  // Parse session data if it exists and is a string
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }

  // Show loading text while session data is being fetched
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Redirect to login page if no session is found
  if (session == null) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint, // Set active tab color based on theme
        headerShown: true, // Show header for each tab
        tabBarButton: HapticTab, // Use custom HapticTab component for tab buttons
        tabBarBackground: TabBarBackground, // Use custom background for the tab bar
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute", // Absolute positioning for iOS
          },
          default: {}, // Default style for other platforms
        }),
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // Tab title
          headerTitle: "Cook It", // Header title
          headerTitleStyle: {
            fontSize: 22, // Font size for header title
            fontFamily: "Boldonse", // Custom font for header title
            padding: 10, // Padding for header title
            height: 80, // Height for header
          },
          headerTitleAlign: "left", // Align header title to the left
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28} // Icon size
              name={focused ? "home" : "home-outline"} // Icon changes based on focus state
              color={color} // Icon color
            />
          ),
        }}
      />
      {/* Add Tab */}
      <Tabs.Screen
        name="add"
        options={{
          title: "Add", // Tab title
          headerTitleStyle: {
            fontSize: 22, // Font size for header title
            fontFamily: "Boldonse", // Custom font for header title
            padding: 10, // Padding for header title
            height: 80, // Height for header
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28} // Icon size
              name={focused ? "add-circle" : "add-circle-outline"} // Icon changes based on focus state
              color={color} // Icon color
            />
          ),
        }}
      />
      {/* Search Tab */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Search", // Tab title
          headerTitleStyle: {
            fontSize: 22, // Font size for header title
            fontFamily: "Boldonse", // Custom font for header title
            padding: 10, // Padding for header title
            height: 80, // Height for header
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28} // Icon size
              name={focused ? "search" : "search-outline"} // Icon changes based on focus state
              color={color} // Icon color
            />
          ),
        }}
      />
      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: `${user.name}`, // Tab title dynamically set to user's name
          headerTitleStyle: {
            fontSize: 22, // Font size for header title
            fontFamily: "Boldonse", // Custom font for header title
            padding: 10, // Padding for header title
            height: 80, // Height for header
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28} // Icon size
              name={focused ? "person-circle" : "person-circle-outline"} // Icon changes based on focus state
              color={color} // Icon color
            />
          ),
        }}
      />
    </Tabs>
  );
}
