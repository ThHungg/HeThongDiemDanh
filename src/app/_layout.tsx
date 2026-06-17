import { Stack } from "expo-router";
import React from "react";
import { ReactQueryProvider } from "../providers/ReactQueryProvider";

import "../global.css";

export default function TabLayout() {
  return (
    <ReactQueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/loginScreen" />
      </Stack>
    </ReactQueryProvider>
  );
}
