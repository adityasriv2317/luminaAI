import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  MenuTwoLineIcon,
  UserIcon,
  SentIcon,
} from "@hugeicons/core-free-icons";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const checkWelcomeScreen = async () => {
      const welcomeScreenShown =
        await AsyncStorage.getItem("welcomeScreenShown");
      if (welcomeScreenShown === null) {
        router.replace("/(basics)/Login");
      } else {
      }
    };
    checkWelcomeScreen();
  }, []);

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      {/* top bar */}
      <View className="w-full flex-row items-center justify-between border-b">
        <TouchableOpacity className="px-4 py-2">
          <HugeiconsIcon icon={MenuTwoLineIcon} size={24} color="#10b981" />
        </TouchableOpacity>

        <Text className="text-green-400 text-xl">Lumina AI</Text>

        {/* profile button */}
        <TouchableOpacity className="px-4 py-2">
          <HugeiconsIcon icon={UserIcon} size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Lumina AI
        </Text>
        <Text className="text-lg text-gray-700 dark:text-gray-300 text-center">
          Welcome to Lumina AI, your personal assistant for everything AI!
        </Text>
      </View>

      {/* text input bar */}
      <View className="w-full absolute bottom-8 px-4 pb-4">
        <View className="flex-row items-center bg-gray-900 rounded-full py-2 px-4 border border-green-200">
          <TextInput
            className="flex-1 h-12 text-gray-900"
            placeholder="Type your message..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={1}
            style={{ maxHeight: 100 }}
          />
          <TouchableOpacity className="ml-2 p-2 bg-white rounded-full">
            <HugeiconsIcon icon={SentIcon} size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
