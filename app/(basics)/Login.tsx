import { Ionicons } from "@expo/vector-icons";
import {
  Modal,
  Pressable,
  Animated as RNAnimated,
  Dimensions,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import LoginWindow from "../../components/LoginWindow";
import SignupWindow from "../../components/SignupWindow";

export default function Login() {
  const rotation = useSharedValue(0);
  const [sheetOpen, setSheetOpen] = useState<null | "login" | "signup">(null);

  const screenHeight = Dimensions.get("window").height;
  const translateY = useRef(new RNAnimated.Value(screenHeight)).current;

  // --- PAN GESTURE ---
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          handleCloseSheet();
        } else {
          RNAnimated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleOpenSheet = (type: "login" | "signup") => {
    setSheetOpen(type);
    translateY.setValue(screenHeight); // start off-screen
    RNAnimated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseSheet = () => {
    RNAnimated.timing(translateY, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSheetOpen(null));
  };

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="flex-1 items-center justify-center">
      <LinearGradient
        colors={["#064e3b", "#18181b", "#09090b"]}
        className="absolute inset-0"
      />

      {/* animated rotating globe */}
      <View>
        <Animated.View
          style={[{ width: 180, height: 180 }, animatedStyle]}
          className="items-center justify-center"
        >
          <Ionicons name="earth" size={140} color="#fff" />
        </Animated.View>
        <Text className="text-white text-center font-semibold text-3xl mb-4">
          Lumina AI
        </Text>
      </View>

      {/* buttons */}
      <View className="flex-col absolute bottom-4 gap-4 w-full px-14 mb-12">
        <TouchableOpacity
          style={{ backgroundColor: "#fff" }}
          className="rounded-full w-full py-2 px-4"
          onPress={() => handleOpenSheet("login")}
        >
          <Text className="text-green-800 font-semibold text-center text-2xl">
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: "#047857" }}
          className="rounded-full w-full py-2 px-4"
          onPress={() => handleOpenSheet("signup")}
        >
          <Text className="text-white font-semibold text-center text-2xl">
            Signup
          </Text>
        </TouchableOpacity>
      </View>

      {/* Custom Bottom Sheet */}
      <Modal
        visible={!!sheetOpen}
        animationType="none"
        transparent
        onRequestClose={handleCloseSheet}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={handleCloseSheet}
        >
          <RNAnimated.View
            {...panResponder.panHandlers}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: screenHeight * 0.55,
              backgroundColor: "#18181b",
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              paddingBottom: 24,
              transform: [{ translateY }],
            }}
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
              {sheetOpen === "login" ? <LoginWindow /> : null}
              {sheetOpen === "signup" ? <SignupWindow /> : null}
            </KeyboardAvoidingView>
          </RNAnimated.View>
        </Pressable>
      </Modal>
    </View>
  );
}
