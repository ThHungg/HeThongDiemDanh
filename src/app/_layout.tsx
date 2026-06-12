import { Stack } from "expo-router";
import React from "react";

import "../global.css";
export default function TabLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/loginScreen" />
    </Stack>
  );
}
