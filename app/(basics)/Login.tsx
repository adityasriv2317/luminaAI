import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import LoginWindow from "../../components/LoginWindow";
import SignupWindow from "../../components/SignupWindow";

export default function Login() {
  const screenHeight = Dimensions.get("window").height;

  // --- Globe rotation ---
  const rotation = useSharedValue(0);
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const globeStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // --- Bottom sheet & overlay ---
  const sheetTranslateY = useSharedValue(screenHeight * 0.55);
  const sheetOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const [sheetOpen, setSheetOpen] = useState<null | "login" | "signup">(null);

  // Open sheet
  const openSheet = (type: "login" | "signup") => {
    setSheetOpen(type);
    overlayOpacity.value = withTiming(0.5, { duration: 300 });
    sheetTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    sheetOpacity.value = withTiming(1, { duration: 250 });
  };

  // Close sheet
  const closeSheet = () => {
    overlayOpacity.value = withTiming(0, { duration: 250 });
    sheetTranslateY.value = withSpring(screenHeight * 0.55, {
      damping: 15,
      stiffness: 150,
    });
    sheetOpacity.value = withTiming(0, { duration: 250 }, () => {
      runOnJS(setSheetOpen)(null);
    });
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetTranslateY.value }],
    opacity: sheetOpacity.value,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0,0,0,${overlayOpacity.value})`,
  }));

  // --- Pan gesture for sheet drag ---
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) sheetTranslateY.value = gestureState.dy;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) closeSheet();
      else
        sheetTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    },
  });

  return (
    <View className="flex-1 items-center justify-center">
      {/* Background gradient */}
      <LinearGradient
        colors={["#064e3b", "#18181b", "#09090b"]}
        className="absolute inset-0"
      />

      {/* Rotating globe */}
      <View>
        <Animated.View
          style={[{ width: 180, height: 180 }, globeStyle]}
          className="items-center justify-center"
        >
          <Ionicons name="earth" size={140} color="#fff" />
        </Animated.View>
        <Text className="text-white text-center font-semibold text-3xl mb-4">
          Lumina AI
        </Text>
      </View>

      {/* Login/Signup buttons */}
      <View className="flex-col absolute bottom-4 gap-4 w-full px-14 mb-12">
        <TouchableOpacity
          style={{ backgroundColor: "#fff" }}
          className="rounded-full w-full py-2 px-4"
          onPress={() => openSheet("login")}
        >
          <Text className="text-green-800 font-semibold text-center text-2xl">
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "#047857" }}
          className="rounded-full w-full py-2 px-4"
          onPress={() => openSheet("signup")}
        >
          <Text className="text-white font-semibold text-center text-2xl">
            Signup
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for sheet */}
      <Modal
        visible={!!sheetOpen}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        {/* Overlay */}
        <Pressable style={{ flex: 1 }} onPress={closeSheet}>
          <Animated.View
            style={[{ flex: 1 }, overlayStyle]}
            pointerEvents="box-none"
          />
        </Pressable>

        {/* Bottom sheet */}
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight * 0.55,
              backgroundColor: "#012525",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingBottom: 24,
              zIndex: 10,
            },
            sheetStyle,
          ]}
        >
          <View style={{ alignItems: "center", paddingTop: 12 }}>
            <View
              style={{
                width: 48,
                height: 5,
                borderRadius: 3,
                backgroundColor: "#10b981",
                marginBottom: 8,
              }}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
          >
            {sheetOpen === "login" && <LoginWindow />}
            {sheetOpen === "signup" && <SignupWindow />}
          </KeyboardAvoidingView>
        </Animated.View>
      </Modal>
    </View>
  );
}
