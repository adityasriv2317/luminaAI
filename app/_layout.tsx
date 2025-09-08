import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../global.css";

import { ChatProvider } from "@/constants/chatContext";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ChatProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true,
              animation: "ios_from_right",
            }}
          />
          {/* <Stack.Screen name="index" />
            <Stack.Screen name="(basics)/profile" />
            <Stack.Screen name="(basics)/Login" />
          </Stack> */}
          <Toast />
        </ChatProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
