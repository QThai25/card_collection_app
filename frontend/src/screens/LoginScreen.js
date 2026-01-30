import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import api from "../api/axiosInstance";
import { useAuth } from "../auth/AuthContext";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_H } = Dimensions.get("window");

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res?.data?.token;
      const user = res?.data?.user;

      if (token && user) {
        await login(token, user);
        Toast.show({
          type: "success",
          text1: "Đăng nhập thành công",
        });
        router.replace("/home");
      } else {
        Toast.show({
          type: "error",
          text1: "Phản hồi không hợp lệ từ server",
        });
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Không xác định";
      Toast.show({
        type: "error",
        text1: "Lỗi đăng nhập",
        text2: message,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ImageBackground
            source={{
              uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
            }}
            style={styles.bg}
            resizeMode="cover"
          >
            <LinearGradient
              pointerEvents="none"
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
              style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.formBox}>
              <Text style={styles.title}>Đăng Nhập</Text>

              {/* Email */}
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email là bắt buộc",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không hợp lệ",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Email"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    textColor="#fff"
                    placeholderTextColor="#ffb6c1"
                    outlineColor="#e91e63"
                    activeOutlineColor="#e91e63"
                    style={styles.input}
                    theme={{
                      roundness: 12,
                      colors: {
                        background: "transparent",
                      },
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email.message}</Text>
              )}

              {/* Password */}
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Mật khẩu là bắt buộc",
                  minLength: {
                    value: 6,
                    message: "Mật khẩu tối thiểu 6 ký tự",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder="Mật khẩu"
                    mode="outlined"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                    textColor="#fff"
                    placeholderTextColor="#ffb6c1"
                    outlineColor="#e91e63"
                    activeOutlineColor="#e91e63"
                    style={styles.input}
                    theme={{
                      roundness: 12,
                      colors: {
                        background: "transparent",
                      },
                    }}
                  />
                )}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}

              <Button
                mode="contained"
                buttonColor="#e91e63"
                onPress={handleSubmit(onSubmit)}
                style={styles.loginBtn}
                contentStyle={{ height: 50 }}
              >
                Đăng Nhập
              </Button>

              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.registerText}>
                  Chưa có tài khoản?{" "}
                  <Text style={styles.registerLink}>Đăng ký ngay</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

/* ================= STYLES ================= */

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
  formBox: {
    width: "85%",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 22,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 14,
  },
  errorText: {
    color: "#ff6b6b",
    fontSize: 13,
    marginBottom: 8,
  },
  loginBtn: {
    borderRadius: 25,
    marginTop: 10,
    marginBottom: 18,
  },
  registerText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 15,
  },
  registerLink: {
    color: "#e91e63",
    fontWeight: "700",
  },
});
