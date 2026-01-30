import React, { useState, useEffect } from "react";
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import api from "../../src/api/axiosInstance";
import { useAuth } from "../../src/auth/AuthContext";
import Toast from "react-native-toast-message";

export default function AdminTab() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState("");
  const [code, setCode] = useState("");
  const [image, setImage] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role !== "admin") return;
    api
      .get("/cards")
      .then((res) => {
        setCards(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets?.[0]) setImage(result.assets[0]);
  };

  const handleCreate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rarity", rarity);
    formData.append("code", code);
    if (image?.uri) {
      const filename = image.uri.split('/').pop() || 'image.jpg';
      formData.append("image", {
        uri: image.uri,
        type: image.type || "image/jpeg",
        name: filename,
      } as any);
    }
    try {
      const res = await api.post("/cards", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCards([...cards, res.data]);
      Toast.show({ type: "success", text1: "Đã tạo card" });
      setTitle("");
      setDescription("");
      setRarity("");
      setCode("");
      setImage(null);
    } catch {
      Toast.show({ type: "error", text1: "Lỗi tạo" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/cards/${id}`);
      setCards(cards.filter((c) => c._id !== id));
      Toast.show({ type: "success", text1: "Đã xóa" });
    } catch {
      Toast.show({ type: "error", text1: "Lỗi xóa" });
    }
  };

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );

  if (user?.role !== "admin") {
    return (
      <View style={styles.centered}>
        <Text>Chỉ admin mới có quyền truy cập</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        label="Rarity"
        value={rarity}
        onChangeText={setRarity}
        style={styles.input}
      />
      <TextInput
        label="Code"
        value={code}
        onChangeText={setCode}
        style={styles.input}
      />
      <Button onPress={pickImage} style={styles.btn}>
        Chọn ảnh
      </Button>
      <Button mode="contained" onPress={handleCreate} style={styles.btn}>
        Tạo card
      </Button>
      <FlatList
        data={cards}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.cardRow}>
            <Text style={styles.cardText}>{item.title}</Text>
            <Button
              onPress={() => handleDelete(item._id)}
              style={styles.deleteBtn}
            >
              Xóa
            </Button>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  input: { marginBottom: 12 },
  btn: { marginBottom: 12 },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cardText: { fontSize: 16, fontWeight: "600" },
  deleteBtn: { backgroundColor: "#8B0000" },
});
