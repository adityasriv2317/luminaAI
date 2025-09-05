import {
  MenuTwoLineIcon,
  SentIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const router = useRouter();

  useEffect(() => {
    const checkWelcomeScreen = async () => {
      const welcomeScreenShown =
        await AsyncStorage.getItem("welcomeScreenShown");
      const storedUsername = welcomeScreenShown
        ? await AsyncStorage.getItem("username")
        : "";
      setUsername(storedUsername ?? "");
      if (welcomeScreenShown === null) {
        router.replace("/(basics)/Login");
      } else {
      }
    };
    checkWelcomeScreen();
  }, []);

  const [username, setUsername] = useState("");

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      {/* top bar */}
      <View className="w-full flex-row items-center py-2 justify-between border-b border-b-gray-700">
        <TouchableOpacity className="px-4 py-2">
          <HugeiconsIcon icon={MenuTwoLineIcon} size={24} color="#10b581" />
        </TouchableOpacity>

        <Text className="text-green-400 text-2xl">Lumina AI</Text>

        {/* profile button */}
        <TouchableOpacity className="px-4 py-2">
          <HugeiconsIcon icon={UserIcon} size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-4xl font-bold text-green-50 mb-4">
          Welcome{username ? `, ${username}` : ""}!
        </Text>
        <Text className="text-lg text-gray-300 mx-4 text-center">
          Welcome to Lumina AI, your personal assistant for everything AI!
        </Text>
      </View>

      {/* text input bar */}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={10}
        style={{ width: "100%" }}
      >
        <View className="flex-row items-center mx-6 bg-gray-900 rounded-full py-2 px-4 border border-green-200">
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
