import React from 'react';
import { StyleSheet, View } from 'react-native';
import QRScannerAddScreen from '../src/screens/QRScannerAddScreen';

/**
 * QR Scanner Screen for Expo Router
 * Wrapper around the existing QRScannerAddScreen component
 */
export default function QRScannerRoute() {
  return (
    <View style={styles.container}>
      <QRScannerAddScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
