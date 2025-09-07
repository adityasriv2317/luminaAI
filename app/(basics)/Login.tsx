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
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LoginWindow from "@/components/LoginWindow";
import SignupWindow from "@/components/SignupWindow";
import AnimPath from "@/constants/path";

export default function Login() {
  const screenHeight = Dimensions.get("window").height;

  const sheetTranslateY = useSharedValue(screenHeight * 0.55);
  const sheetOpacity = useSharedValue(0);
  const overlayOpacity = useSharedValue(0);
  const [sheetOpen, setSheetOpen] = useState<null | "login" | "signup">(null);

  const openSheet = (type: "login" | "signup") => {
    setSheetOpen(type);
    overlayOpacity.value = withTiming(0.5, { duration: 300 });
    sheetTranslateY.value = withSpring(0, { damping: 15, stiffness: 150 });
    sheetOpacity.value = withTiming(1, { duration: 250 });
  };

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#0f172a", "#18181b", "#09090b"]}
        className="absolute inset-0 -z-10"
      />

      {/* Rotating globe and app title */}
      <View style={styles.centerContent}>
        <LottieView
          source={require("@/assets/landing.json")}
          style={{ width: 280, height: 280 }}
          autoPlay
          loop
        />
        <Text style={styles.topAppBarTitle}>Lumina AI</Text>
        <Text style={styles.appTitle}>Your AI Assistant</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => openSheet("login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => openSheet("signup")}
        >
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for bottom sheet */}
      <Modal
        visible={!!sheetOpen}
        transparent
        animationType="none"
        onRequestClose={closeSheet}
      >
        <Pressable style={{ flex: 1 }} onPress={closeSheet}>
          <Animated.View
            style={[{ flex: 1 }, overlayStyle]}
            pointerEvents="box-none"
          />
        </Pressable>

        <Animated.View
          {...panResponder.panHandlers}
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight * 0.55,
              backgroundColor: "#16341e",
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
                backgroundColor: "#22c55e",
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
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#10151a",
  },
  topAppBarTitle: {
    color: "#22c55e",
    fontSize: 32,
    fontWeight: "800",
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitle: {
    color: "#e2e5f3",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 16,
  },
  loginButton: {
    backgroundColor: "#ddd",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#047857",
    fontSize: 20,
    fontWeight: "600",
  },
  signupButton: {
    backgroundColor: "#22c55e",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
} as const;
