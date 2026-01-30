import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "../../hooks/use-color-scheme";

export default function TabLayout() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  const colors = {
    light: {
      tabBarBackground: "#ffffff",
      tabBarActiveTintColor: "#007AFF",
      tabBarInactiveTintColor: "#999999",
    },
    dark: {
      tabBarBackground: "#1a1a1a",
      tabBarActiveTintColor: "#64B5F6",
      tabBarInactiveTintColor: "#666666",
    },
  };

  const theme = colorScheme === "dark" ? colors.dark : colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          height: Platform.OS === "web" ? 60 : 80,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: "Collection",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      {user?.role === "admin" && (
        <Tabs.Screen
          name="admin"
          options={{
            title: "Admin",
            href: user?.role === "admin" ? undefined : null,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tabs>
  );
}
