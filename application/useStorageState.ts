import { useEffect, useCallback, useReducer } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Type alias for the custom hook's return type
type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

// Custom hook to manage asynchronous state
function useAsyncState<T>(
    initialValue: [boolean, T | null] = [true, null], // Initial state: loading (true) and null value
): UseStateHook<T> {
    return useReducer(
        // Reducer function to update state
        (state: [boolean, T | null], action: T | null = null): [boolean, T | null] => [false, action], // Set loading to false and update value
        initialValue
    ) as UseStateHook<T>;
}

// Function to set a key-value pair in storage (localStorage for web, SecureStore for native)
export async function setStorageItemAsync(key: string, value: string | null) {
    if (Platform.OS === 'web') {
        // Handle web storage
        try {
            if (value === null) {
                localStorage.removeItem(key); // Remove item if value is null
            } else {
                localStorage.setItem(key, value); // Set item in localStorage
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e); // Log error if localStorage is unavailable
        }
    } else {
        // Handle native storage using SecureStore
        if (value == null) {
            await SecureStore.deleteItemAsync(key); // Delete item if value is null
        } else {
            await SecureStore.setItemAsync(key, value); // Set item in SecureStore
        }
    }
}

// Custom hook to manage state synchronized with storage
export function useStorageState(key: string): UseStateHook<string> {
    // Public state and setter
    const [state, setState] = useAsyncState<string>();

    // Effect to load the initial value from storage
    useEffect(() => {
        if (Platform.OS === 'web') {
            // Handle web storage
            try {
                if (typeof localStorage !== 'undefined') {
                    setState(localStorage.getItem(key)); // Load value from localStorage
                }
            } catch (e) {
                console.error('Local storage is unavailable:', e); // Log error if localStorage is unavailable
            }
        } else {
            // Handle native storage using SecureStore
            SecureStore.getItemAsync(key).then(value => {
                setState(value); // Load value from SecureStore
            });
        }
    }, [key]); // Re-run effect if the key changes

    // Callback to update the state and storage
    const setValue = useCallback(
        (value: string | null) => {
            setState(value); // Update state
            setStorageItemAsync(key, value); // Update storage
        },
        [key] // Dependency array ensures callback is updated when key changes
    );

    return [state, setValue]; // Return state and setter
}
