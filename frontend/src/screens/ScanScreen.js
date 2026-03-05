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
import { useRouter } from "expo-router";

export default function AddByCodeScreen() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleAddByCode = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      Toast.show({ type: "error", text1: "Nhập mã thẻ" });
      return;
    }

    if (!user) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng nhập", onPress: () => router.push("/login") },
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/cards/scan", { code: trimmed });

      Toast.show({
        type: "success",
        text1: res.data?.message || "Đã thêm thẻ",
      });

      const card = res.data?.card;
      if (card?._id) {
        router.replace(`/card/${card._id}`);
      } else {
        router.back();
      }
    } catch (err) {
      const status = err?.response?.status;
      Toast.show({
        type: "error",
        text1: status === 404 ? "Không tìm thấy thẻ" : "Không thể thêm thẻ",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Thêm thẻ bằng mã</Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="CARD-2025-0005"
          style={styles.input}
          autoCapitalize="characters"
        />
    
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleAddByCode}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>Thêm</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => router.push("/qr-scanner")}
        >
          <Text style={styles.outlineBtnText}>Quét QR</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e6eef8",
  },
  primaryBtn: {
    backgroundColor: "#0d9488",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  outlineBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  outlineBtnText: { fontWeight: "700" },
});
