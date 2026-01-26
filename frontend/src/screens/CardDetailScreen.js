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
  Alert,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axiosInstance";
import Toast from "react-native-toast-message";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import QRCodeSVG from "react-native-qrcode-svg";
import { MaterialCommunityIcons, Feather, AntDesign } from "@expo/vector-icons";

/*
  LƯU Ý:
  - File mp3 cục bộ của bạn (tên file dài) được dùng làm fallback nếu không có card.voiceUri.
  - Nếu bạn muốn dùng file cục bộ khác, sửa đường dẫn require() ở PLAYBACK_LOCAL.
*/
const PLAYBACK_LOCAL = require("../../assets/voice/nha_tran_ton_tai_qua_12_doi_vua_tri_vi_175_nam_8d5d7d66-3fad-4e15-b33e-693d55a52a56.mp3");
const PLAYBACK_LOCAL1 = require("../../assets/voice/nha_tran_ton_tai_qua_12_doi_vua_tri_vi_175_nam_8d5d7d66-3fad-4e15-b33e-693d55a52a56.mp3");

const rarityLabels = {
  common: "Thường",
  rare: "Hiếm",
  epic: "Sử Thi",
  legendary: "Huyền Thoại",
};

const BREAKPOINT = 700;

const CardDetailScreen = ({ route, navigation }) => {
  const { card } = route.params;
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [soundObj, setSoundObj] = useState(null); // Audio.Sound instance
  const [fav, setFav] = useState(false);
  const [qrVisible, setQrVisible] = useState(false);
  const qrRef = useRef(null);
  const [openQuizId, setOpenQuizId] = useState(null); // accordion
  const [playingQuizId, setPlayingQuizId] = useState(null); // quiz đang đọc
  const [isPaused, setIsPaused] = useState(false); // pause / resume

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener?.("change", ({ window }) =>
      setWindowWidth(window.width)
    );
    return () => {
      if (sub?.remove) sub.remove();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const id = card?._id || card?.id;

    if (!id) return;
    console.log("Card id sent to API:", id);

    api
      .get(`/quizzes/all/${id}`)
      .then((res) => {
        if (mounted) {
          // Luôn là mảng
          setQuiz(Array.isArray(res.data) ? res.data : []);
          console.log("✅ Quiz data received:", res.data);
        }
      })
      .catch((err) => {
        console.error("❌ Lỗi load quiz:", err.response?.status || err.message);
        if (mounted) {
          if (err.response?.status === 404)
            setQuiz([]); // không tìm thấy → mảng rỗng
          else setQuiz(null); // lỗi khác
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [card]);

  // HÀM PHÁT GIỌNG NÓI
  // Ưu tiên: nếu card.voiceUri => phát từ uri
  // Ngược lại: phát file mp3 cục bộ PLAYBACK_LOCAL (giống code gốc của bạn)
  const playVoice = async (item) => {
    try {
      // Nếu đang đọc chính quiz này → pause / resume
      if (playingQuizId === item._id && soundObj) {
        if (isPaused) {
          await soundObj.playAsync();
          setIsPaused(false);
        } else {
          await soundObj.pauseAsync();
          setIsPaused(true);
        }
        return;
      }

      // Nếu đang đọc quiz khác → stop hoàn toàn
      if (soundObj) {
        await soundObj.stopAsync();
        await soundObj.unloadAsync();
      }

      // Play quiz mới
      if (item?.voiceUri) {
        const { sound } = await Audio.Sound.createAsync(
          { uri: item.voiceUri },
          { shouldPlay: true }
        );

        setSoundObj(sound);
        setPlayingQuizId(item._id);
        setIsPaused(false);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            setSoundObj(null);
            setPlayingQuizId(null);
            setIsPaused(false);
          }
        });
      } else {
        // fallback TTS
        Speech.speak(`${item.question}. ${item.explanation || ""}`, {
          language: "vi-VN",
          rate: 0.9,
        });
      }
    } catch (e) {
      console.error("❌ playVoice error:", e);
    }
  };

  // Dừng / unload khi unmount
  useEffect(() => {
    return () => {
      (async () => {
        try {
          if (soundObj) {
            await soundObj.stopAsync().catch(() => {});
            await soundObj.unloadAsync().catch(() => {});
          }
        } catch (e) {
          // ignore
        }
        Speech.stop();
      })();
    };
  }, [soundObj]);

  const handleAdd = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate("AddByCode");
    } else {
      navigation.navigate("AddByCode");
    }
  };

  const toggleFav = () => {
    setFav((v) => !v);
    Toast.show({
      type: "success",
      text1: fav ? "Đã bỏ yêu thích" : "Đã thêm yêu thích",
    });
  };

  const handleShare = async () => {
    try {
      const url = `${
        global?.appBaseUrl || "https://your-site.example.com"
      }/card/${card._id || card.id}`;
      await Share.share({ message: `${card.title || card.name}\n${url}` });
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const imageSource =
    card?.imageUrl ||
    card?.image ||
    "https://via.placeholder.com/600x800?text=No+Image";
  const isWide = windowWidth >= BREAKPOINT;
  const statPct = (val) =>
    val == null ? 0 : Math.min(100, Math.round((val / 30) * 100));

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconBtn}
        >
          <Feather name="arrow-left" size={20} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết thẻ</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, alignItems: "center" }}>
        <View
          style={[
            styles.cardContainer,
            isWide ? styles.rowLayout : styles.columnLayout,
          ]}
        >
          <View
            style={[
              styles.leftCol,
              isWide ? { flex: 0.45 } : { width: "100%" },
            ]}
          >
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: imageSource }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.actionBtn} onPress={toggleFav}>
                <AntDesign
                  name={fav ? "heart" : "heart"}
                  size={16}
                  color={fav ? "#e11d48" : "#0f172a"}
                />

                <Text style={styles.actionBtnText}>Yêu thích</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconOnly}
                onPress={() => setQrVisible(true)}
              >
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={20}
                  color="#0f172a"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconOnly, { marginLeft: 8 }]}
                onPress={handleShare}
              >
                <Feather name="share-2" size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>

            <Modal visible={qrVisible} animationType="fade" transparent>
              <View style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalHint}>
                    Quét mã QR để xem thẻ này
                  </Text>
                  <View style={{ paddingVertical: 12 }}>
                    <QRCodeSVG
                      value={`${
                        global?.appBaseUrl || "https://your-site.example.com"
                      }/card/${card._id || card.id}`}
                      size={220}
                      getRef={(c) => (qrRef.current = c)}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setQrVisible(false)}
                  >
                    <Text style={styles.modalCloseText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>

          <View
            style={[
              styles.rightCol,
              isWide
                ? { flex: 0.55, paddingLeft: 18 }
                : { width: "100%", marginTop: 12 },
            ]}
          >
            <View style={styles.titleRow}>
              <Text style={styles.titleText} numberOfLines={2}>
                {card.title || card.name}
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {rarityLabels[(card.rarity || "common").toLowerCase()] ||
                    "N/A"}
                </Text>
              </View>
            </View>

            {card.series ? (
              <Text style={styles.series}>{card.series}</Text>
            ) : null}

            <View style={styles.block}>
              <Text style={styles.blockTitle}>Mô tả</Text>
              <Text style={styles.blockText}>
                {card.description || "Không có mô tả."}
              </Text>
            </View>

            {card.stats && (
              <View style={styles.block}>
                <Text style={styles.blockTitle}>Chỉ số</Text>

                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>HP</Text>
                    <Text style={styles.statValue}>{card.stats.hp ?? "-"}</Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${statPct(card.stats.hp)}%`,
                          backgroundColor: "#ef4444",
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Tấn công</Text>
                    <Text style={styles.statValue}>
                      {card.stats.attack ?? "-"}
                    </Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${statPct(card.stats.attack)}%`,
                          backgroundColor: "#f97316",
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.statItem}>
                  <View style={styles.statHeader}>
                    <Text style={styles.statLabel}>Phòng thủ</Text>
                    <Text style={styles.statValue}>
                      {card.stats.defense ?? "-"}
                    </Text>
                  </View>
                  <View style={styles.progressBg}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${statPct(card.stats.defense)}%`,
                          backgroundColor: "#3b82f6",
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )}

            {card.history && (
              <View style={styles.block}>
                <Text style={styles.blockTitle}>Lịch sử</Text>
                <Text style={styles.blockText}>{card.history}</Text>
              </View>
            )}

            <View style={styles.block}>
              <Text style={styles.blockTitle}>Thông tin phát hành</Text>
              <Text style={styles.blockText}>
                Ngày phát hành:{" "}
                {card.releaseDate
                  ? new Date(card.releaseDate).toLocaleDateString("vi-VN")
                  : "N/A"}
              </Text>
            </View>

            <View style={{ marginTop: 6 }}>
              {quiz === null ? (
                <Text>Đang tải quiz...</Text>
              ) : quiz.length === 0 ? (
                <Text>Không có câu hỏi cho thẻ này.</Text>
              ) : (
                quiz.map((q, index) => {
                  const isOpen = openQuizId === q._id;
                  const isPlayingThis = playingQuizId === q._id;

                  return (
                    <View key={q._id || index} style={styles.quizCard}>
                      {/* QUESTION */}
                      <TouchableOpacity
                        onPress={() => setOpenQuizId(isOpen ? null : q._id)}
                      >
                        <Text style={styles.quizQ}>{q.question}</Text>
                      </TouchableOpacity>

                      {/* ANSWER */}
                      {isOpen && (
                        <>
                          {q.correctAnswer && (
                            <Text style={styles.quizA}>{q.correctAnswer}</Text>
                          )}

                          {q.explanation && (
                            <Text style={styles.quizExplain}>
                              {q.explanation}
                            </Text>
                          )}

                          {q.voiceUri && (
                            <TouchableOpacity
                              style={styles.playBtn}
                              onPress={() => playVoice(q)}
                            >
                              <Text style={styles.playBtnText}>
                                {isPlayingThis
                                  ? isPaused
                                    ? "▶️ Tiếp tục"
                                    : "⏸ Tạm dừng"
                                  : "🔊 Nghe giọng đọc"}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </>
                      )}
                    </View>
                  );
                })
              )}
            </View>

            <View style={styles.footerBtns}>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleAdd}>
                <Text style={styles.primaryBtnText}>
                  ➕ Thêm vào bộ sưu tập
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.outlineBtn}
                onPress={() => setQrVisible(true)}
              >
                <Text style={styles.outlineBtnText}>Mã QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CardDetailScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    width: "100%",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e6eef8",
  },
  iconBtn: { padding: 6 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cardContainer: { width: "100%", maxWidth: 1100 },
  rowLayout: { flexDirection: "row", alignItems: "flex-start" },
  columnLayout: { flexDirection: "column" },

  leftCol: { alignItems: "center", justifyContent: "flex-start" },
  imageWrap: {
    width: "100%",
    maxWidth: 380,
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  image: { width: "100%", height: "100%" },

  actionRow: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
  },
  actionBtnText: { marginLeft: 8, color: "#0f172a", fontWeight: "600" },
  iconOnly: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginLeft: 8,
    elevation: 2,
  },

  rightCol: { justifyContent: "flex-start" },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
  },
  badgeText: { color: "#0f172a", fontWeight: "700", fontSize: 12 },
  series: { color: "#64748b", marginTop: 6 },

  block: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
    elevation: 2,
  },
  blockTitle: { fontWeight: "700", marginBottom: 6 },
  blockText: { color: "#374151", lineHeight: 20 },

  statItem: { marginBottom: 10 },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  statLabel: { color: "#111" },
  statValue: { fontWeight: "700" },
  progressBg: {
    height: 10,
    backgroundColor: "#e6eef8",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 6 },

  quizCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    elevation: 2,
  },
  quizQ: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  quizA: { marginTop: 8, color: "#374151" },
  quizExplain: { marginTop: 6, color: "#6b7280", fontStyle: "italic" },
  playBtn: {
    marginTop: 10,
    backgroundColor: "#eef2ff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  playBtnText: { color: "#3730a3", fontWeight: "700" },

  footerBtns: { flexDirection: "row", marginTop: 14, alignItems: "center" },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#0d9488",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  outlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0f172a",
    alignItems: "center",
  },
  outlineBtnText: { color: "#0f172a", fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: 340,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  modalHint: { color: "#6b7280", marginBottom: 6 },
  modalCloseBtn: {
    marginTop: 8,
    backgroundColor: "#0f172a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalCloseText: { color: "#fff", fontWeight: "700" },
});
