import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
      <Text className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404
      </Text>
      <Text className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center">
        Oops! The page you are looking for does not exist.
      </Text>
      <Pressable
        className="bg-blue-600 rounded-full px-6 py-3"
        onPress={() => router.replace("/")}
      >
        <Text className="text-white font-semibold text-base">Go Home</Text>
      </Pressable>
    </View>
  );
}
