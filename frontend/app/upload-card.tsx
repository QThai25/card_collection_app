import React from "react";
import { View, StyleSheet } from "react-native";
import UploadCardScreen from "../src/screens/UploadCardScreen";

/**
 * Upload Card Screen for Expo Router
 * Wrapper around the existing UploadCardScreen component
 */
export default function UploadCardRoute() {
  return (
    <View style={styles.container}>
      <UploadCardScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
