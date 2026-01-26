import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ImageBackground } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../auth/AuthContext";

const ProfileScreen = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.loginPrompt}>Bạn chưa đăng nhập</Text>
      </SafeAreaView>
    );
  }

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
      }}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Overlay mờ để chữ nổi bật */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Thông tin cá nhân</Text>

        <View style={styles.infoWrap}>
          <Text style={styles.info}>Username: {user?.name}</Text>
          {user?.email && <Text style={styles.info}>Email: {user.email}</Text>}
        </View>

        <Button
          mode="contained"
          onPress={logout}
          style={styles.logoutBtn}
          labelStyle={{ color: "#fff", fontWeight: "bold" }}
        >
          Đăng xuất
        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loginPrompt: { fontSize: 16, color: "#0f172a" },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  infoWrap: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    elevation: 3,
  },
  info: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 10,
  },
  logoutBtn: {
    width: 150,
    backgroundColor: "#8B0000",
    borderRadius: 8,
  },
});

export default ProfileScreen;
