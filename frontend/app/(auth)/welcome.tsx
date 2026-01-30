import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();

  const titleFont = Math.round(SCREEN_W * 0.075);
  const buttonWidth = Math.min(320, Math.round(SCREEN_W * 0.7));

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
        }}
        resizeMode="cover"
        style={styles.bg}
        imageStyle={styles.bgImage}
      >
        <LinearGradient
          pointerEvents="none"
          colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.25)", "rgba(0,0,0,0.6)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.contentBox}>
          <Text style={[styles.title, { fontSize: titleFont }]}>
            Việt Sử Anh Hùng
          </Text>
          <Text style={styles.subtitle}>
            Chào mừng bạn đến với thế giới thẻ bài lịch sử Việt Nam
          </Text>

          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              buttonColor="#e91e63"
              textColor="#fff"
              onPress={() => router.push("/(auth)/login")}
              contentStyle={{ height: 50 }}
              style={[styles.btn, { width: buttonWidth }]}
            >
              Đăng Nhập
            </Button>

            <Button
              mode="outlined"
              textColor="#fff"
              onPress={() => router.push("/(auth)/register")}
              contentStyle={{ height: 50 }}
              style={[styles.btnOutlined, { width: buttonWidth }]}
            >
              Đăng Ký
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  bg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  contentBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#eee",
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonGroup: {
    alignItems: "center",
    width: "100%",
  },
  btn: {
    borderRadius: 25,
    marginVertical: 8,
    elevation: 3,
  },
  btnOutlined: {
    borderColor: "#fff",
    borderWidth: 1.5,
    borderRadius: 25,
    marginVertical: 8,
  },
});
