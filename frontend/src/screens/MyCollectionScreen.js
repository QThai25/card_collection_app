import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from "react-native";
import api from "../api/axiosInstance";
import CardItem from "../components/CardItem";
import { useAuth } from "../auth/AuthContext";
import Toast from "react-native-toast-message";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const MyCollectionScreen = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigation = useNavigation();
  const windowWidth = Dimensions.get("window").width;

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      api
        .get(`/users/${user.id}/cards`)
        .then((res) => {
          const normalized = (res.data || []).map((uc) =>
            uc.cardId ? uc.cardId : uc
          );
          setCards(normalized);
        })
        .catch((err) => {
          console.error(err);
          Toast.show({ type: "error", text1: "Lỗi tải bộ sưu tập" });
        })
        .finally(() => setLoading(false));
    }, [user])
  );

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B0000" />
      </View>
    );

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.loginPrompt}>
          Bạn cần đăng nhập để xem bộ sưu tập của mình
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Đến trang Đăng nhập</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const totalOwned = cards.length;
  const mockTotal = 100;
  const completionRate =
    mockTotal > 0 ? Math.round((totalOwned / mockTotal) * 1000) / 10 : 0;

  const rarityCounts = cards.reduce(
    (acc, c) => {
      const r = (c.rarity || "common").toLowerCase();
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    },
    { legendary: 0, epic: 0, rare: 0, common: 0 }
  );

  const renderCard = ({ item }) => (
    <CardItem
      card={item}
      onPress={() => navigation.navigate("CardDetail", { card: item })}
    />
  );

  const numColumns = windowWidth > 700 ? 4 : 2;

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Bộ sưu tập của tôi</Text>
          <Text style={styles.headerSub}>Quản lý các thẻ bạn đã sưu tầm</Text>
        </View>

        {/* FlatList với header + cards */}
        <FlatList
          data={cards}
          keyExtractor={(item) =>
            item._id || item.id || `${item.title || item.name}-${Math.random()}`
          }
          renderItem={renderCard}
          numColumns={numColumns}
          columnWrapperStyle={
            numColumns > 1
              ? { justifyContent: "space-between", paddingHorizontal: 12 }
              : null
          }
          contentContainerStyle={{ paddingBottom: 140, paddingTop: 10 }}
          ListHeaderComponent={
            <>
              {/* Stats Box */}
              <View style={styles.statsWrap}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tổng thẻ đã sưu tầm</Text>
                  <Text style={styles.statValue}>{totalOwned}</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tỷ lệ hoàn thành</Text>
                  <Text style={styles.statValue}>{completionRate}%</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Tiến độ</Text>
                  <View style={styles.progressBg}>
                    <View
                      style={[styles.progressFill, { width: `${completionRate}%` }]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {totalOwned} / {mockTotal} thẻ
                  </Text>
                </View>
              </View>

              {/* Rarity breakdown */}
              <View style={styles.rarityWrap}>
                <View style={styles.rarityCard}>
                  <Text style={styles.rarityNumber}>{rarityCounts.legendary}</Text>
                  <Text style={styles.rarityLabel}>Huyền thoại</Text>
                </View>
                <View style={styles.rarityCard}>
                  <Text style={[styles.rarityNumber, { color: "#7c3aed" }]}>
                    {rarityCounts.epic}
                  </Text>
                  <Text style={styles.rarityLabel}>Sử thi</Text>
                </View>
                <View style={styles.rarityCard}>
                  <Text style={[styles.rarityNumber, { color: "#0284c7" }]}>
                    {rarityCounts.rare}
                  </Text>
                  <Text style={styles.rarityLabel}>Hiếm</Text>
                </View>
                <View style={styles.rarityCard}>
                  <Text style={[styles.rarityNumber, { color: "#64748b" }]}>
                    {rarityCounts.common}
                  </Text>
                  <Text style={styles.rarityLabel}>Thường</Text>
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Thẻ của bạn</Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>
                Bạn chưa có thẻ bài nào. Hãy bắt đầu sưu tầm ngay!
              </Text>
            </View>
          }
        />

        {/* Add Button */}
        <TouchableOpacity
          onPress={() => {
            const parent = navigation.getParent();
            if (parent) parent.navigate("AddByCode");
            else navigation.navigate("AddByCode");
          }}
          style={styles.addButton}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "transparent" },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    backgroundColor: "transparent",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#fff" },
  headerSub: { color: "#e0e0e0", marginTop: 4 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loginPrompt: { fontSize: 16, marginBottom: 20 },
  loginButton: {
    backgroundColor: "#8B0000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: { color: "#fff", fontWeight: "bold" },

  statsWrap: {
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.3)", // mờ, BG rõ
    margin: 12,
    borderRadius: 12,
    elevation: 3,
  },
  statCard: { marginBottom: 12 },
  statLabel: { color: "#6b7280", fontSize: 13 },
  statValue: { fontSize: 22, fontWeight: "800", marginTop: 4 },

  progressBg: {
    height: 10,
    backgroundColor: "rgba(230,238,248,0.6)",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  progressFill: { height: "100%", backgroundColor: "#06b6d4" },
  progressText: { marginTop: 6, color: "#6b7280", fontSize: 12 },

  rarityWrap: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, marginTop: 6 },
  rarityCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.3)", // mờ, BG rõ
    margin: 6,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },
  rarityNumber: { fontSize: 20, fontWeight: "800", color: "#b45309" },
  rarityLabel: { color: "#6b7280", marginTop: 6 },

  sectionHeader: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 6 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#fff" },

  emptyWrap: { padding: 24, alignItems: "center" },
  emptyText: { color: "#e0e0e0" },

  addButton: {
    position: "absolute",
    bottom: 25,
    right: 25,
    backgroundColor: "#8B0000",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },

  bg: { flex: 1, width: "100%", height: "100%" },
});

export default MyCollectionScreen;
