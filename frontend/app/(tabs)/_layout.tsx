import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-by-code" options={{ headerShown: true, title: "Thêm thẻ bằng mã" }} />
      <Stack.Screen name="scan-qr" options={{ headerShown: true, title: "Quét mã QR" }} />
      <Stack.Screen name="card/[id]" options={{ headerShown: true, title: "Chi tiết thẻ" }} />
    </Stack>
  );
}
