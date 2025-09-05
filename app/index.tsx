import {
  ArrowExpand01Icon,
  Copy01Icon,
  SentIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../constants/auth";
import TypingIndicator from "@/components/Typing";

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

  const [talking, SetTalking] = useState(false);
  const [message, SetMessage] = useState(null);
  const [chat, SetChat] = useState<
    Array<{ sender: number; text: string; expand: boolean }>
  >([]);
  const [position, SetPostion] = useState(0);

  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    setError("");
    setResponse("");
    if (!question.trim()) {
      setError("Please enter a question.");
      return;
    }
    const userMessage = { sender: 0, text: question, expand: true };
    SetChat((prev) => [...prev, userMessage]);
    setLoading(true);
    SetTalking(true);
    setQuestion("");
    try {
      const res = await axios.post(`${BASE_URL}/ask`, { query: question });
      setResponse(res.data?.answer || "No response.");

      const botMessage = { sender: 1, text: res.data?.answer, expand: false };
      SetChat((prev) => [...prev, botMessage]);
    } catch (err: any) {
      let msg = "Failed to get response.";
      if (err?.response?.data?.message) msg = err.response.data.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i: any) => {
    SetChat((prev) =>
      prev.map((msg, ind) =>
        ind === i ? { ...msg, expand: !msg.expand } : msg
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-black">
      {/* top bar */}
      <View className="w-full flex-row items-center py-2 justify-around border-b border-b-gray-700">
        {/* <TouchableOpacity className="px-4 py-2">
          <HugeiconsIcon icon={MenuTwoLineIcon} size={24} color="#10b581" />
        </TouchableOpacity> */}

        <Text className="text-green-400 p-2 text-center w-full text-2xl">
          Lumina AI
        </Text>

        {/* profile button */}
        <TouchableOpacity
          onPress={() => {
            router.push("/profile");
          }}
          className="p-2 border absolute top-0 right-0 border-green-600 rounded-full mr-2"
        >
          <HugeiconsIcon icon={UserIcon} size={18} color="#10b981" />
        </TouchableOpacity>
      </View>

      {talking ? (
        <ScrollView className="w-full h-full px-2 flex-1 inset-0">
          {chat.map((msg, i) => (
            <View
              key={i}
              className={`flex w-full mt-4 ${msg.sender === 0 ? "items-end" : "items-start"}`}
            >
              <View
                className={`p-4 rounded-b-3xl max-w-[75%] ${msg.sender === 0 ? "bg-gray-800 rounded-l-3xl" : "rounded-r-3xl bg-green-950"}`}
              >
                <Text className="leading-relaxed text-white text-md">
                  {msg.expand ? msg.text : `${msg.text.slice(0, 250)}...`}
                </Text>
              </View>
              <View
                className={`flex flex-row gap-0.5 w-full ${msg.sender === 0 ? "items-end justify-end" : "items-start justify-start"}`}
              >
                <TouchableOpacity
                  className="bg-white/10 rounded-full p-2"
                  onPress={() => toggleExpand(i)}
                >
                  <HugeiconsIcon
                    icon={ArrowExpand01Icon}
                    color="#fff"
                    size={14}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {}}
                  className="bg-white/10 rounded-full p-2"
                >
                  <HugeiconsIcon icon={Copy01Icon} color="#fff" size={14} />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {loading && (
            <View className="bg-green-900/50 w-20 mt-4 flex items-center justify-center py-1 rounded-r-3xl rounded-b-3xl">
              <TypingIndicator />
            </View>
          )}
        </ScrollView>
      ) : (
        <Animated.View
          className="flex-1 items-center justify-center px-6"
          entering={FadeIn.duration(700)}
        >
          <Text className="text-4xl font-bold text-green-50 mb-4">
            Welcome{username ? `, ${username}` : ""}!
          </Text>
          <Text className="text-lg text-gray-300 mx-4 text-center">
            Welcome to Lumina AI, your personal assistant for everything AI!
          </Text>
        </Animated.View>
      )}

      {/* text input bar */}
      <KeyboardAvoidingView
        // behavior="padding"
        behavior="position"
        // keyboardVerticalOffset={10}
        style={{ width: "100%", zIndex: 10, position: "absolute", bottom: 20 }}
      >
        <View
          style={{ zIndex: 10 }}
          className="flex-row items-center mx-6 bg-green-900/20 rounded-full py-2 px-4 border border-green-200"
        >
          <TextInput
            className="flex-1 text-xl font-bold h-12 text-white"
            placeholder="ask anything..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={1}
            style={{ maxHeight: 100 }}
            value={question}
            onChangeText={setQuestion}
            editable={!loading}
            onSubmitEditing={handleAsk}
            returnKeyType="send"
          />
          <TouchableOpacity
            className="ml-2 p-2 bg-white rounded-full"
            onPress={handleAsk}
            disabled={loading}
          >
            <HugeiconsIcon icon={SentIcon} size={24} color="#000000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
