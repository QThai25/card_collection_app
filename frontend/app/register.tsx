import React from 'react';
import { StyleSheet } from 'react-native';
import RegisterScreen from '../src/screens/RegisterScreen';

/**
 * Register Screen for Expo Router
 * Wrapper around the existing RegisterScreen component
 */
export default function RegisterRoute() {
  return <RegisterScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
