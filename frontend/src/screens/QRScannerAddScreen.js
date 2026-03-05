import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import api from "../api/axiosInstance";

let Html5QrcodeScanner = null;

// ⚠️ CHỈ require trên web
if (Platform.OS === "web") {
  Html5QrcodeScanner = require("html5-qrcode").Html5QrcodeScanner;
}

export default function QRScannerScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  // ===== WEB QR =====
  useEffect(() => {
    if (Platform.OS !== "web") return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (text) => {
        scanner.clear();
        handleScan(text);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  const handleScan = async (value) => {
    if (!value || loading) return;

    setLoading(true);
    try {
      const res = await api.post("/users/scan", { code: value });

      Toast.show({
        type: "success",
        text1: "Đã thêm thẻ",
      });

      const cardId = res?.data?.card?._id;
      if (cardId) {
        router.replace(`/card/${cardId}`);
      } else {
        router.back();
      }
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "QR không hợp lệ",
      });
    } finally {
      setLoading(false);
    }
  };

  // ===== MOBILE CAMERA =====
  if (Platform.OS !== "web") {
    if (!permission) return null;

    if (!permission.granted) {
      return (
        <View style={styles.center}>
          <Text onPress={requestPermission}>
            Cấp quyền camera
          </Text>
        </View>
      );
    }

    return (
      <CameraView
        style={{ flex: 1 }}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={({ data }) => handleScan(data)}
      />
    );
  }

  // ===== WEB UI =====
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Quét QR (Web)</Text>

      {/* ⚠️ div CHỈ DÙNG CHO WEB */}
      <div id="qr-reader" style={{ width: 300 }} />

      {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    marginBottom: 12,
  },
});
