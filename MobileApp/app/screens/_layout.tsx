import { Stack } from "expo-router";

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" options={{ title: "Login" }} />
      <Stack.Screen name="InfoScreen" options={{ title: "Info" }} />
      <Stack.Screen name="Game" options={{ title: "Game" }} />
      <Stack.Screen name="Quattro" options={{ title: "Quattro" }} />
      <Stack.Screen name="Result" options={{ title: "Result" }} />
    </Stack>
  );
}
