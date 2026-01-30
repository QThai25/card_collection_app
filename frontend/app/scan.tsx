import React from "react";
import { View, StyleSheet } from "react-native";
import ScanScreen from "../src/screens/ScanScreen";

/**
 * Scan Screen for Expo Router
 * Wrapper around the existing ScanScreen component
 */
export default function ScanRoute() {
  return (
    <View style={styles.container}>
      <ScanScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
