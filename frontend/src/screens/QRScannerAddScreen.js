// src/screens/QRScannerAddScreen.js
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axiosInstance";
import Toast from "react-native-toast-message";

function parseScannedData(data) {
  if (!data || typeof data !== "string") return { type: null, value: null };

  data = data.trim();

  // ObjectId('68e...') hoặc ObjectId("68e...")
  let m = data.match(/ObjectId\(['"]?([0-9a-fA-F]{24})['"]?\)/);
  if (m) return { type: "cardId", value: m[1] };

  // raw 24-hex id
  m = data.match(/^([0-9a-fA-F]{24})$/);
  if (m) return { type: "cardId", value: m[1] };

  // url containing /card/<id>
  m = data.match(/\/card\/([0-9a-fA-F]{24})/);
  if (m) return { type: "cardId", value: m[1] };

  // query param id=...
  m = data.match(/[?&]id=([0-9a-fA-F]{24})/);
  if (m) return { type: "cardId", value: m[1] };

  // code like CARD-2025-0005 (or any non-object code)
  m = data.match(/^[A-Z0-9\-_]{4,}$/i);
  if (m && data.toUpperCase().startsWith("CARD-"))
    return { type: "code", value: data };

  // card://<id>
  if (data.startsWith("card://")) {
    const v = data.replace("card://", "");
    if (/^[0-9a-fA-F]{24}$/.test(v)) return { type: "cardId", value: v };
    return { type: "code", value: v };
  }

  // fallback: if it contains "CARD-" anywhere, take that
  m = data.match(/(CARD-[\w\-]+)/i);
  if (m) return { type: "code", value: m[1] };

  return { type: null, value: data };
}

export default function QRScannerAddScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraType, setCameraType] = useState("back");
  const cameraRef = useRef(null);
  const { user, token, logout } = useAuth(); // hãy đảm bảo AuthContext cung cấp token và logout

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

 const handleScanned = async ({ data }) => {
  if (scanned) return;
  setScanned(true);

  const parsed = parseScannedData(data);
  console.log("Scanned data parsed:", parsed);

  if (!parsed.type) {
    Toast.show({ type: "error", text1: "QR không hợp lệ" });
    setScanned(false);
    return;
  }

  if (!user || !token) {
    Toast.show({ type: "error", text1: "Bạn cần đăng nhập để thêm thẻ" });
    navigation.navigate("Login");
    return;
  }

  setLoading(true);
  try {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const body =
      parsed.type === "cardId" ? { cardId: parsed.value } : { code: parsed.value };

    const res = await api.post("/users/scan", body);
    console.log("[DEBUG] /users/scan response:", res?.data);

    // nếu server trả thông báo "thẻ đã tồn tại"
    if (res.data?.exists) {
      Toast.show({ type: "info", text1: res.data.message || "Thẻ đã tồn tại" });
    } else {
      Toast.show({
        type: "success",
        text1: res.data?.message || "Đã thêm thẻ vào bộ sưu tập",
      });
    }

    // điều hướng nếu có card object
    if (res.data?.card?._id) {
      navigation.replace("CardDetail", { card: res.data.card });
      return;
    }
    if (res.data?.cardId) {
      const cardRes = await api.get(`/cards/${res.data.cardId}`);
      navigation.replace("CardDetail", { card: cardRes.data });
      return;
    }

    navigation.goBack();
  } catch (err) {
    console.error("[DEBUG] API call failed:", err?.response?.data || err);

    const status = err?.response?.status;
    const data = err?.response?.data;

    if (status === 401 || (data && /invalid token/i.test(JSON.stringify(data)))) {
      Toast.show({
        type: "error",
        text1: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
      });
      logout && logout();
      navigation.navigate("Login");
    } else if (status === 403) {
      Toast.show({ type: "error", text1: data?.message || "Không có quyền" });
    } else {
      Toast.show({ type: "error", text1: data?.message || "Không thể thêm thẻ" });
    }

    setScanned(false);
  } finally {
    setLoading(false);
  }
};



  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Đang yêu cầu quyền camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>Không có quyền camera. Vui lòng cấp quyền trong cài đặt.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Cấp quyền</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={cameraType}
        onBarcodeScanned={scanned ? undefined : handleScanned}
      />

      {scanned && !loading && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            onPress={() => setScanned(false)}
            style={styles.actionBtn}
          >
            <Text style={styles.actionText}>Quét lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.actionBtn, { backgroundColor: "#ddd" }]}
          >
            <Text>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: "#fff", marginTop: 8 }}>Đang thêm thẻ...</Text>
        </View>
      )}

      <View style={styles.topRight}>
        <TouchableOpacity
          onPress={() =>
            setCameraType((t) => (t === "back" ? "front" : "back"))
          }
          style={styles.iconBtn}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  bottomBar: {
    position: "absolute",
    bottom: 28,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    backgroundColor: "#0d9488",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: { color: "#fff", fontWeight: "700" },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  topRight: { position: "absolute", top: 40, right: 16 },
  iconBtn: { backgroundColor: "rgba(0,0,0,0.4)", padding: 8, borderRadius: 8 },
  btn: {
    backgroundColor: "#0d9488",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
  },
  btnText: { color: "#fff" },
});
