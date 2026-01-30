import { Stack , useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../src/auth/AuthContext";
import { useEffect } from "react";

import { ActivityIndicator, View } from "react-native";

function AuthGate({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return; // Still loading, don't redirect yet

    const inAuthGroup = segments[0] === "(auth)";

    if (user) {
      // User is logged in, redirect to tabs if in auth group
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      // User is not logged in, redirect to welcome if not in auth group
      if (!inAuthGroup) {
        router.replace("/(auth)/welcome");
      }
    }
  }, [user, loading, segments, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGate>
        <Stack 
          screenOptions={{ 
            headerShown: false,
          }} 
        />
      </AuthGate>
    </AuthProvider>
  );
}
