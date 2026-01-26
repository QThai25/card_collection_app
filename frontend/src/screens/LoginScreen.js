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
import { useNavigation } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      const token = res?.data?.token;
      const user = res?.data?.user;
      if (token && user) {
        await login(token, user);
        Toast.show({ type: "success", text1: "Đăng nhập thành công" });
      } else {
        Toast.show({ type: "error", text1: "Phản hồi không hợp lệ từ server" });
      }
    } catch (err) {
      const serverMessage =
        err?.response?.data?.message || err.message || "Không xác định";
      Toast.show({ type: "error", text1: "Lỗi đăng nhập: " + serverMessage });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: insets.top }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ImageBackground
            source={{
              uri: "https://res.cloudinary.com/dwonhfsfj/image/upload/v1761622132/BG_web_jljyeh.png",
            }}
            style={styles.bg}
            resizeMode="cover"
            imageStyle={styles.bgImage}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.7)"]}
              style={StyleSheet.absoluteFillObject}
            />

            <View
              style={[
                styles.formBox,
                { paddingTop: Math.max(16, insets.top + 8) },
              ]}
            >
              <Text style={styles.title}>Đăng Nhập</Text>

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
                    label=""
                    placeholder="Email"
                    placeholderTextColor="#ffb6c1"
                    accessibilityLabel="email-input"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    textColor="#fff"
                    outlineColor="#e91e63"
                    activeOutlineColor="#e91e63"
                    dense
                    style={styles.input}
                    theme={{
                      roundness: 12,
                      colors: {
                        text: "#fff",
                        primary: "#e91e63",
                        placeholder: "#ffb6c1",
                        background: "transparent",
                      },
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorText}>
                  {errors.email.message || "Email là bắt buộc"}
                </Text>
              )}

              {/* Password */}
              <Controller
                control={control}
                name="password"
                rules={{
                  required: { value: true, message: "Mật khẩu là bắt buộc" },
                  minLength: {
                    value: 6,
                    message: "Mật khẩu tối thiểu 6 ký tự",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label=""
                    placeholder="Mật khẩu"
                    placeholderTextColor="#ffb6c1"
                    accessibilityLabel="password-input"
                    mode="outlined"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry
                    textColor="#fff"
                    outlineColor="#e91e63"
                    activeOutlineColor="#e91e63"
                    dense
                    style={styles.input}
                    theme={{
                      roundness: 12,
                      colors: {
                        text: "#fff",
                        primary: "#e91e63",
                        placeholder: "#ffb6c1",
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
                accessibilityRole="button"
                mode="contained"
                buttonColor="#e91e63"
                textColor="#fff"
                onPress={handleSubmit(onSubmit)}
                style={styles.loginBtn}
                contentStyle={{ height: 50 }}
              >
                Đăng Nhập
              </Button>

              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.registerText}>
                  Chưa có tài khoản?{" "}
                  <Text style={{ color: "#e91e63", fontWeight: "700" }}>
                    Đăng ký ngay
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

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
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
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
    marginBottom: 8,
  },
});

export default LoginScreen;
