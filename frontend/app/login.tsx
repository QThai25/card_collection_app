import React from 'react';
import { StyleSheet } from 'react-native';
import LoginScreen from '../src/screens/LoginScreen';

/**
 * Login Screen for Expo Router
 * Wrapper around the existing LoginScreen component
 */
export default function LoginRoute() {
  return <LoginScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
