import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
        <Toast />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
