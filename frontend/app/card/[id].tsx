import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Share,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "../../src/auth/AuthContext";
import api from "../../src/api/axiosInstance";
import Toast from "react-native-toast-message";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import QRCodeSVG from "react-native-qrcode-svg";
import {
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";

const rarityLabels: Record<string, string> = {
  common: "Thường",
  rare: "Hiếm",
  epic: "Sử Thi",
  legendary: "Huyền Thoại",
};

const BREAKPOINT = 700;

export default function CardDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();

  const [card, setCard] = useState<any>(null);
  const [quiz, setQuiz] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrVisible, setQrVisible] = useState(false);

  const [soundObj, setSoundObj] = useState<Audio.Sound | null>(null);
  const [playingQuizId, setPlayingQuizId] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const qrRef = useRef<any>(null);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  /* ---------------- window resize ---------------- */
  useEffect(() => {
    const sub = Dimensions.addEventListener?.("change", ({ window }) =>
      setWindowWidth(window.width)
    );
    return () => sub?.remove?.();
  }, []);

  /* ---------------- load card + quiz ---------------- */
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    Promise.all([
      api.get(`/cards/${id}`),
      api.get(`/quizzes/all/${id}`),
    ])
      .then(([cardRes, quizRes]) => {
        if (!mounted) return;
        setCard(cardRes.data);
        setQuiz(Array.isArray(quizRes.data) ? quizRes.data : []);
      })
      .catch(() => {
        Toast.show({
          type: "error",
          text1: "Không tải được dữ liệu thẻ",
        });
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  /* ---------------- audio cleanup ---------------- */
  useEffect(() => {
    return () => {
      if (soundObj) {
        soundObj.stopAsync().catch(() => {});
        soundObj.unloadAsync().catch(() => {});
      }
      Speech.stop();
    };
  }, [soundObj]);

  const playVoice = async (q: any) => {
    try {
      if (playingQuizId === q._id && soundObj) {
        if (isPaused) {
          await soundObj.playAsync();
          setIsPaused(false);
        } else {
          await soundObj.pauseAsync();
          setIsPaused(true);
        }
        return;
      }

      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      if (q.voiceUri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: q.voiceUri },
          { shouldPlay: true }
        );
        setSoundObj(sound);
        setPlayingQuizId(q._id);
        setIsPaused(false);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            setSoundObj(null);
            setPlayingQuizId(null);
          }
        });
      } else {
        Speech.speak(`${q.question}. ${q.explanation || ""}`, {
          language: "vi-VN",
        });
      }
    } catch {}
  };

  const handleAdd = () => {
    router.push("/add-by-code");
  };

  const handleShare = async () => {
    await Share.share({
      message: `${card.title}\nhttps://your-site.example.com/card/${id}`,
    });
  };

  if (loading || !card) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const isWide = windowWidth >= BREAKPOINT;

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thẻ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Image source={{ uri: card.imageUrl }} style={styles.image} />

        <Text style={styles.title}>{card.title}</Text>
        <Text style={styles.badge}>
          {rarityLabels[card.rarity?.toLowerCase()] || "N/A"}
        </Text>

        <Text style={styles.desc}>{card.description}</Text>

        {/* QUIZ */}
        {quiz.map((q) => (
          <View key={q._id} style={styles.quizCard}>
            <Text style={styles.quizQ}>{q.question}</Text>

            <TouchableOpacity onPress={() => playVoice(q)}>
              <Text style={styles.playBtn}>
                {playingQuizId === q._id
                  ? isPaused
                    ? "▶️ Tiếp tục"
                    : "⏸ Tạm dừng"
                  : "🔊 Nghe giọng đọc"}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* FOOTER */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleAdd}>
          <Text style={styles.primaryBtnText}>➕ Thêm vào bộ sưu tập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShare} style={styles.outlineBtn}>
          <Text>Chia sẻ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
  },
  headerTitle: { fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "100%", height: 420, borderRadius: 12 },
  title: { fontSize: 22, fontWeight: "800", marginTop: 12 },
  badge: { marginTop: 4, color: "#64748b" },
  desc: { marginTop: 10, lineHeight: 20 },
  quizCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  quizQ: { fontWeight: "600" },
  playBtn: { marginTop: 6, color: "#4f46e5" },
  primaryBtn: {
    backgroundColor: "#0d9488",
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  outlineBtn: {
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
});
