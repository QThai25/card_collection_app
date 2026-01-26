// src/navigation/AppNavigator.js
import React from "react";
import { View, ActivityIndicator } from "react-native";
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

// NOTE: dùng đúng tên file màn bạn tạo
import AddByCodeScreen from "../screens/AddByCodeScreen"; // màn nhập mã (Add by code)
import QRScannerAddScreen from "../screens/QRScannerAddScreen"; // màn quét QR

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab chính
const MainTabs = () => {
  const { user } = useAuth();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreenMain} />
      <Tab.Screen name="MyCollection" component={MyCollectionScreen} options={{ title: "My Collection" }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      {user?.role === "admin" && <Tab.Screen name="Admin" component={AdminScreen} />}
    </Tab.Navigator>
  );
};

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {/* MainTabs là tab navigator chính */}
            <Stack.Screen name="MainTabs" component={MainTabs} />

            {/* Màn nhập mã (Add by code). Gọi bằng navigation.navigate("AddByCode") */}
            <Stack.Screen
              name="AddByCode"
              component={AddByCodeScreen}
              options={{ headerShown: true, title: "Thêm thẻ bằng mã" }}
            />

            {/* Màn quét QR. Gọi bằng navigation.navigate("QRScannerAdd") */}
            <Stack.Screen
              name="QRScannerAdd"
              component={QRScannerAddScreen}
              options={{ headerShown: true, title: "Quét mã QR" }}
            />
          </>
        )}

        {/* CardDetail có thể mở từ bất kỳ tab nào */}
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
