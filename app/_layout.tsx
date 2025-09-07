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
          <Toast />
        </ChatProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
