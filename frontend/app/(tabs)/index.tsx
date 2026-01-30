import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import api from "../../src/api/axiosInstance";

export default function HomeTab() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const router = useRouter();
  const CARD_WIDTH = windowWidth * 0.42;
  const CARD_HEIGHT = CARD_WIDTH * 1.6;

  useEffect(() => {
    const sub = Dimensions.addEventListener?.("change", ({ window }) =>
      setWindowWidth(window.width)
    );
    return () => {
      if (sub?.remove) sub.remove();
    };
  }, []);

  useEffect(() => {
    api
      .get("/cards")
      .then((res) => setCards(res.data))
      .catch((err) => console.error("❌ Lỗi load cards:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>🏅 Thẻ nổi bật</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {cards.map((card) => (
              <TouchableOpacity
                key={card._id}
                style={[
                  styles.card,
                  { width: CARD_WIDTH, height: CARD_HEIGHT },
                ]}
                onPress={() => router.push(`/card/${card._id}`)}
              >
                <Image
                  source={{ uri: card.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />

                <View style={styles.cardFooter}>
                  <Text numberOfLines={1} style={styles.cardTitle}>
                    {card.title}
                  </Text>
                  <Text numberOfLines={1} style={styles.cardSub}>
                    Anh hùng lịch sử
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8B0000",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff7ed",
    borderRadius: 18,
    marginRight: 12,
    overflow: "hidden",
    elevation: 4,
  },
  cardImage: {
    flex: 1,
    width: "100%",
  },
  cardFooter: {
    padding: 10,
    backgroundColor: "rgba(139,0,0,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 20,
  },
  cardSub: {
    color: "#fde68a",
    fontSize: 18,
  },
});
