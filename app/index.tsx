import {
  ArrowExpand01Icon,
  Copy01Icon,
  MenuTwoLineIcon,
  SentIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FormattedText from "@/components/FormattedText";
import Toast from "react-native-toast-message";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  Easing,
  Layout,
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import TypingIndicator from "@/components/Typing";
import { BASE_URL } from "@/constants/auth";
import { DrawerLayoutAndroid } from "react-native-gesture-handler";
import { ChatDrawer } from "@/components/Drawer";
import { useChat } from "@/constants/chatContext";
import { getToken } from "@/constants/saveToken";

export default function HomeScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const {
    chatId,
    chat,
    setChat,
    inputMessage,
    setInputMessage,
    setChatTitle,
    chatTitle,
    createNewChat,
    getChats,
  } = useChat();
  const [talking, setTalking] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const sendScale = useSharedValue(1);

  interface ChatMessage {
    sender: number;
    text: string;
    expand: boolean;
  }

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
      }
    };
    checkWelcomeScreen();
  }, []);

  useEffect(() => {
    if (!chatId) {
      createNewChat();
    }
  }, [chatId]);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chat, loading]);

  const handleAsk = async () => {
    setError("");
    if (!inputMessage.trim()) {
      setError("Please enter a question.");
      return;
    }
    const userMessage = { sender: 0, text: inputMessage, expand: true };
    setChat((prev: any[]) => [...prev, userMessage]);
    setLoading(true);
    setTalking(true);
    setInputMessage("");
    try {
      const token = await getToken();
      const res = await axios.post(
        `${BASE_URL}/chats/${chatId}/message`,
        {
          query: userMessage.text,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const botMessage = { sender: 1, text: res.data?.answer, expand: false };
      setChat((prev: any[]) => [
        ...(Array.isArray(prev) ? prev : []),
        botMessage,
      ]);
      setChatTitle(res.data?.title || "New Chat");
    } catch (err: any) {
      let msg = "Failed to get response.";
      if (err?.response?.data?.message) msg = err.response.data.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (i: number) => {
    setChat((prev: any[]) =>
      Array.isArray(prev)
        ? prev.map((msg: any, ind: number) =>
            ind === i && msg ? { ...msg, expand: !msg.expand } : msg
          )
        : []
    );
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Toast.show({
      type: "success",
      text1: "Copied to clipboard!",
      position: "bottom",
      visibilityTime: 2000,
    });
  };

  const sendButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));

  const drawerRef = useRef<DrawerLayoutAndroid>(null);

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={320}
      drawerPosition="left"
      drawerBackgroundColor={"transparent"}
      renderNavigationView={() => <ChatDrawer />}
      onDrawerOpen={getChats}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.topAppBar}>
          <TouchableOpacity
            onPress={() => {
              drawerRef.current?.openDrawer();
            }}
            style={styles.menuButton}
          >
            <HugeiconsIcon icon={MenuTwoLineIcon} size={22} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.topAppBarTitle}>
            {talking ? chatTitle : "Lumina AI"}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(basics)/profile")}
            style={styles.profileButton}
          >
            <HugeiconsIcon icon={UserIcon} size={22} color="#22c55e" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          behavior={"padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {talking ? (
            <ScrollView
              ref={scrollViewRef}
              contentContainerStyle={styles.scrollContainer}
            >
              {chat.map((msg: ChatMessage, i: number) => (
                <Animated.View
                  key={i}
                  entering={FadeInDown.duration(450).easing(
                    Easing.out(Easing.exp)
                  )}
                  layout={Layout.springify().damping(20).stiffness(150)}
                  className={`flex w-full mt-4 ${
                    msg.sender === 0 ? "items-end" : "items-start"
                  }`}
                >
                  <View
                    className={`p-4 rounded-b-3xl max-w-[80%] ${
                      msg.sender === 0
                        ? "bg-gray-800 rounded-l-3xl"
                        : "bg-green-700 rounded-r-3xl"
                    }`}
                  >
                    <FormattedText
                      text={
                        msg.expand ? msg.text : `${msg.text.slice(0, 250)}...`
                      }
                      style={{
                        fontSize: 16,
                        color: "#fff",
                        lineHeight: 24,
                      }}
                    />
                  </View>
                  <View
                    className={`flex flex-row gap-0.5 w-full mt-1.5 ${
                      msg.sender === 0
                        ? "items-end justify-end"
                        : "items-start justify-start"
                    }`}
                  >
                    <TouchableOpacity
                      className="bg-zinc-800/50 rounded-full p-1.5"
                      onPress={() => toggleExpand(i)}
                    >
                      <HugeiconsIcon
                        icon={ArrowExpand01Icon}
                        color="#fff"
                        size={14}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleCopy(msg.text)}
                      className="bg-zinc-800/50 rounded-full p-1.5"
                    >
                      <HugeiconsIcon icon={Copy01Icon} color="#fff" size={14} />
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              ))}

              {loading && (
                <Animated.View
                  entering={FadeInLeft.duration(500).easing(
                    Easing.out(Easing.exp)
                  )}
                  exiting={FadeInRight.duration(400).easing(
                    Easing.in(Easing.exp)
                  )}
                  className="bg-[#16241e] w-20 mt-4 flex items-center justify-center py-1 rounded-r-2xl rounded-b-2xl"
                >
                  <TypingIndicator />
                </Animated.View>
              )}
            </ScrollView>
          ) : (
            <Animated.View
              className="flex-1 items-center justify-center px-6"
              style={{ backgroundColor: "#000" }}
              entering={FadeInUp.duration(800).easing(Easing.out(Easing.exp))}
            >
              <Text className="text-4xl font-extrabold text-green-500 mb-2 text-center">
                Welcome{username ? `, ${username}` : ""}!
              </Text>
              <Text className="text-base text-gray-400 mx-4 text-center">
                Your personal assistant for everything AI. Start a conversation
                below.
              </Text>
            </Animated.View>
          )}

          <Animated.View
            entering={FadeInUp.duration(600).easing(Easing.out(Easing.exp))}
            style={styles.inputBarContainer}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Ask anything..."
              placeholderTextColor="#9ca3b8"
              multiline
              value={inputMessage}
              onChangeText={setInputMessage}
              editable={!loading}
              onSubmitEditing={handleAsk}
              returnKeyType="send"
            />
            <TouchableOpacity
              onPressIn={() => {
                sendScale.value = withSpring(0.9, {
                  damping: 15,
                  stiffness: 200,
                });
              }}
              onPressOut={() => {
                sendScale.value = withSpring(1, {
                  damping: 15,
                  stiffness: 200,
                });
              }}
              style={[styles.sendButton, loading && styles.sendButtonDisabled]}
              onPress={handleAsk}
              disabled={loading}
            >
              <Animated.View style={sendButtonStyle}>
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <HugeiconsIcon icon={SentIcon} size={20} color="#ffffff" />
                )}
              </Animated.View>
            </TouchableOpacity>
          </Animated.View>

          {talking && (
            <Animated.View
              entering={FadeIn.duration(500).easing(Easing.out(Easing.exp))}
            >
              <Text className="text-gray-400 text-center">
                Verify answers from AI before utilising them.
              </Text>
            </Animated.View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#10151a",
  },
  topAppBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#10151a",
    borderBottomWidth: 2,
    borderBottomColor: "#ffffff18",
    position: "relative",
  },
  topAppBarTitle: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "800",
  },
  profileButton: {
    position: "absolute",
    right: 16,
    top: 12,
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#16241e",
  },
  menuButton: {
    position: "absolute",
    left: 16,
    top: 12,
    padding: 8,
    borderRadius: 999,
    backgroundColor: "#16241e",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingBottom: 20,
    backgroundColor: "#000000",
    justifyContent: "flex-end",
  },
  inputBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: "#16241e",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#22c55e40",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: "#e5e7eb",
    minHeight: 32,
    maxHeight: 120,
    paddingTop: Platform.OS === "ios" ? 4 : 0,
    paddingBottom: 0,
  },
  sendButton: {
    padding: 10,
    backgroundColor: "#22c55e",
    borderRadius: 999,
  },
  sendButtonDisabled: {
    backgroundColor: "#166534",
  },
});
