import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"; // Importing navigation themes and provider
import { useFonts } from "expo-font"; // Hook to load custom fonts
import * as SplashScreen from "expo-splash-screen"; // Splash screen handling
import { StatusBar } from "expo-status-bar"; // Status bar component
import { useEffect } from "react"; // React hook for side effects
import "react-native-reanimated"; // Required for animations
import { Stack } from "expo-router"; // Stack navigation from Expo Router
import { SessionProvider } from "../ctx"; // Context provider for session management
import { GlobalProvider } from "../GlobalContext"; // Global context provider

import { useColorScheme } from "@/hooks/useColorScheme"; // Custom hook to detect color scheme

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding until fonts are loaded

export default function RootLayout() {
  const colorScheme = useColorScheme(); // Detect system color scheme (light/dark)
  const [loaded] = useFonts({
    Boldonse: require("../assets/fonts/Boldonse-Regular.ttf"), // Load custom font Boldonse
    ByteSized: require("../assets/fonts/Bytesized-Regular.ttf"), // Load custom font ByteSized
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"), // Load custom font SpaceMono
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
    }
  }, [loaded]); // Dependency array ensures this runs when `loaded` changes

  if (!loaded) {
    return null; // Render nothing until fonts are loaded
  }

  return (
    <GlobalProvider>
      {" "}
      {/* Provides global state to the app */}
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        {" "}
        {/* Applies theme based on color scheme */}
        <SessionProvider>
          {" "}
          {/* Provides session state to the app */}
          <Stack>
            {" "}
            {/* Stack navigator for managing screens */}
            <Stack.Screen
              name="(tabs)" // Main tab navigation screen
              options={{
                headerShown: false, // Hide header for this screen
              }}
            />
            <Stack.Screen
              name="recipe" // Recipe details screen
              options={{
                headerShown: true, // Show header for this screen
                title: "Recipe", // Set header title
              }}
            />
            <Stack.Screen
              name="register" // Registration screen
              options={{
                headerShown: false, // Hide header for this screen
              }}
            />
            <Stack.Screen
              name="login" // Login screen
              options={{
                headerShown: false, // Hide header for this screen
              }}
            />
          </Stack>
        </SessionProvider>
        <StatusBar style="auto" />{" "}
        {/* Automatically adjusts status bar style */}
      </ThemeProvider>
    </GlobalProvider>
  );
}
