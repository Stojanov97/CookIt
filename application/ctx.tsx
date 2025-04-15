import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "./useStorageState";

// Create a context for authentication with default values
const AuthContext = createContext<{
  signIn: (user: any) => void; // Function to handle user sign-in
  signOut: () => void; // Function to handle user sign-out
  session?: string | null; // Current session data (if any)
  isLoading: boolean; // Indicates if session data is being loaded
}>({
  signIn: () => null, // Default no-op implementation for signIn
  signOut: () => null, // Default no-op implementation for signOut
  session: null, // Default session is null
  isLoading: false, // Default loading state is false
});

// Custom hook to access the authentication context
export function useSession() {
  const value = useContext(AuthContext); // Access the AuthContext value
  if (process.env.NODE_ENV !== "production") {
    // Development-only check to ensure the hook is used within a provider
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value; // Return the context value
}

// Provider component to manage authentication state and provide it to children
export function SessionProvider({ children }: PropsWithChildren) {
  // useStorageState hook manages session state in local storage
  const [[isLoading, session], setSession] = useStorageState("session");

  return (
    <AuthContext.Provider
      value={{
        signIn: (user) => {
          // Perform sign-in logic here
          let credentials = JSON.stringify(user); // Convert user data to JSON string
          setSession(credentials); // Save session data to storage
        },
        signOut: () => {
          // Perform sign-out logic here
          setSession(null); // Clear session data from storage
        },
        session, // Current session data
        isLoading, // Loading state
      }}
    >
      {children} {/* Render child components */}
    </AuthContext.Provider>
  );
}
