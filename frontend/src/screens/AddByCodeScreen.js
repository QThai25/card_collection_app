import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import api from "../api/axiosInstance";
import Toast from "react-native-toast-message";
import { useAuth } from "../auth/AuthContext";

export default function AddByCodeScreen({ navigation }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleAddByCode = async () => {
  const trimmed = (code || "").trim();
  if (!trimmed) {
    Toast.show({ type: "error", text1: "Nhập mã thẻ" });
    return;
  }

  if (!user) {
    Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để thêm thẻ", [
      { text: "Hủy", style: "cancel" },
      { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
    ]);
    return;
  }

  setLoading(true);
  try {
    const res = await api.post("/users/scan", { code: trimmed });

    // ⭐⭐⭐ QUAN TRỌNG
    if (res.data?.success === false) {
      Toast.show({
        type: "info", // ❌ không đỏ
        text1: res.data.message,
      });
      return;
    }

    Toast.show({
      type: "success",
      text1: res.data?.message || "Đã thêm thẻ",
    });

    if (res.data?.card) {
      navigation.replace("CardDetail", { card: res.data.card });
    } else {
      navigation.goBack();
    }

  } catch (err) {
    console.error("addByCode network err:", err);
    Toast.show({
      type: "error",
      text1: "Không thể kết nối server",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Thêm thẻ bằng mã</Text>
        <Text style={styles.label}>Nhập mã thẻ (ví dụ: CARD-2025-0005)</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Mã thẻ..."
          style={styles.input}
          autoCapitalize="characters"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.primaryBtn} onPress={handleAddByCode} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>Thêm vào bộ sưu tập</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={() => navigation.navigate("QRScannerAdd")}>
          <Text style={styles.outlineBtnText}>Hoặc quét mã QR</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Mã thẻ phải là duy nhất. Nếu không tìm thấy, admin phải tạo mã cho thẻ.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  label: { marginBottom: 6, color: "#374151" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#e6eef8" },
  primaryBtn: { backgroundColor: "#0d9488", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  outlineBtn: { marginTop: 12, paddingVertical: 12, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#0f172a" },
  outlineBtnText: { color: "#0f172a", fontWeight: "700" },
  hint: { color: "#6b7280", marginTop: 8, fontSize: 13 },
});
