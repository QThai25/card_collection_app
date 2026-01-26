// src/navigation/AppNavigator.js
import React from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../auth/AuthContext";

import HomeScreenMain from "../screens/HomeScreen";
import MyCollectionScreen from "../screens/MyCollectionScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AdminScreen from "../screens/AdminScreen";
import CardDetailScreen from "../screens/CardDetailScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import AddByCodeScreen from "../screens/AddByCodeScreen";
import QRScannerAddScreen from "../screens/QRScannerAddScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* =======================
   🔗 Linking cho WEB
======================= */
const linking = {
  prefixes: ["/"],
  config: {
    screens: {
      Welcome: "",
      Login: "login",
      Register: "register",
      MainTabs: {
        screens: {
          Home: "home",
          MyCollection: "collection",
          Profile: "profile",
          Admin: "admin",
        },
      },
      AddByCode: "add-by-code",
      QRScannerAdd: "scan-qr",
      CardDetail: "card/:id",
    },
  },
};

/* =======================
   Tabs chính
======================= */
const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { fontSize: 12 },
        ...(Platform.OS === "web"
          ? { tabBarStyle: { height: 60 } }
          : {}),
      }}
    >
      <Tab.Screen name="Home" component={HomeScreenMain} />
      <Tab.Screen
        name="MyCollection"
        component={MyCollectionScreen}
        options={{ title: "My Collection" }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === "admin" && (
        <Tab.Screen name="Admin" component={AdminScreen} />
      )}
    </Tab.Navigator>
  );
};

/* =======================
   App Navigator
======================= */
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      linking={Platform.OS === "web" ? linking : undefined}
      fallback={
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="AddByCode"
              component={AddByCodeScreen}
              options={{ headerShown: true, title: "Thêm thẻ bằng mã" }}
            />
            <Stack.Screen
              name="QRScannerAdd"
              component={QRScannerAddScreen}
              options={{ headerShown: true, title: "Quét mã QR" }}
            />
          </>
        )}

        <Stack.Screen
          name="CardDetail"
          component={CardDetailScreen}
          options={{ headerShown: true, title: "Chi tiết thẻ" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
