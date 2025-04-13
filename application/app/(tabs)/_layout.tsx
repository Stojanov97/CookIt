import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Text } from "react-native";
import { Redirect } from "expo-router";

import { useSession } from "../../ctx";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();
  let user: any;
  if (session !== null && typeof session === "string") {
    user = JSON.parse(session);
  }
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  if (session == null) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Cook It",
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: "Boldonse",
            padding: 10,
            height: 80,
          },
          headerTitleAlign: "left",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: "Boldonse",
            padding: 10,
            height: 80,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: "Boldonse",
            padding: 10,
            height: 80,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "search" : "search-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: `${user.name}`,
          headerTitleStyle: {
            fontSize: 22,
            fontFamily: "Boldonse",
            padding: 10,
            height: 80,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              size={28}
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
