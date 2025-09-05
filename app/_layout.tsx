import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "../global.css";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
