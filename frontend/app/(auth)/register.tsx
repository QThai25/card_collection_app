import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import api from "../../src/api/axiosInstance";
import { useAuth } from "../../src/auth/AuthContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function RegisterScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [focusedField, setFocusedField] = useState("");

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/register", data);
      const token = res?.data?.token;
      const user = res?.data?.user;
      if (token && user) {
        await login(token, user);
        Toast.show({ type: "success", text1: "Đăng ký thành công!" });
        // auth guard will redirect automatically
      } else {
        Toast.show({ type: "error", text1: "Phản hồi không hợp lệ từ server" });
      }
    } catch (err: unknown) {
      const msg = (err as any)?.response?.data?.message || (err as any)?.message || "Lỗi không xác định";
      Toast.show({ type: "error", text1: "Lỗi đăng ký: " + msg });
    }
  };

  const getOutlineColor = (field) =>
    focusedField === field ? "#e91e63" : "#aaa";

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{
            uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761566814/z7161336079336_1fc1682d70aa13d8a6bc402c6172f98d_fdarzy.jpg",
          }}
          style={styles.bg}
          resizeMode="cover"
          imageStyle={styles.bgImage}
        >
          <LinearGradient
            pointerEvents="none"
            colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
            style={StyleSheet.absoluteFillObject}
          />

          <View
            style={[
              styles.formBox,
              { paddingTop: Math.max(16, insets.top + 8) },
            ]}
          >
            <Text style={styles.title}>Đăng Ký</Text>

            {/* Name */}
            <Controller
              control={control}
              name="name"
              rules={{
                required: { value: true, message: "Tên là bắt buộc" },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Họ và tên"
                  placeholderTextColor="#ffb6c1"
                  value={value || ""}
                  onChangeText={onChange}
                  mode="outlined"
                  textColor="#fff"
                  outlineColor={getOutlineColor("name")}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                  theme={{
                    roundness: 10,
                    colors: {
                      placeholder:
                        focusedField === "name" ? "#e91e63" : "#ccc",
                      text: "#fff",
                      primary: "#e91e63",
                      background: "transparent",
                    },
                  }}
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{typeof errors.name?.message === 'string' ? errors.name.message : 'Lỗi'}</Text>
            )}

            {/* Email */}
            <Controller
              control={control}
              name="email"
              rules={{
                required: { value: true, message: "Email là bắt buộc" },
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#ffb6c1"
                  value={value || ""}
                  onChangeText={onChange}
                  mode="outlined"
                  textColor="#fff"
                  outlineColor={getOutlineColor("email")}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                  theme={{
                    roundness: 10,
                    colors: {
                      placeholder:
                        focusedField === "email" ? "#e91e63" : "#ccc",
                      text: "#fff",
                      primary: "#e91e63",
                      background: "transparent",
                    },
                  }}
                />
              )}
            />
            {errors.email && (
              <Text style={styles.errorText}>{typeof errors.email?.message === 'string' ? errors.email.message : 'Lỗi'}</Text>
            )}

            {/* Password */}
            <Controller
              control={control}
              name="password"
              rules={{
                required: { value: true, message: "Mật khẩu là bắt buộc" },
                minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Mật khẩu"
                  placeholderTextColor="#ffb6c1"
                  value={value || ""}
                  onChangeText={onChange}
                  secureTextEntry
                  mode="outlined"
                  textColor="#fff"
                  outlineColor={getOutlineColor("password")}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  style={styles.input}
                  theme={{
                    roundness: 10,
                    colors: {
                      placeholder:
                        focusedField === "password" ? "#e91e63" : "#ccc",
                      text: "#fff",
                      primary: "#e91e63",
                      background: "transparent",
                    },
                  }}
                />
              )}
            />
            {errors.password && (
              <Text style={styles.errorText}>{typeof errors.password?.message === 'string' ? errors.password.message : 'Lỗi'}</Text>
            )}

            <Button
              mode="contained"
              buttonColor="#e91e63"
              textColor="#fff"
              onPress={handleSubmit(onSubmit)}
              style={styles.registerBtn}
              contentStyle={{ height: 50 }}
            >
              Đăng Ký
            </Button>

            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginText}>
                Đã có tài khoản?{" "}
                <Text style={{ color: "#e91e63", fontWeight: "700" }}>
                  Đăng nhập ngay
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
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
  formBox: {
    width: "85%",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 18,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 12,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginBottom: 6,
  },
  registerBtn: {
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 16,
  },
  loginText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 8,
  },
});
