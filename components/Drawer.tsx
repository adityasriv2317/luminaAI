import {
  Delete01Icon,
  PlusSignIcon,
  Pulse01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { act } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat } from "@/constants/chatContext";

export function ChatDrawer() {
  const chatHistory = [
    { id: "1", message: "Hello!" },
    { id: "2", message: "How are you?" },
    { id: "3", message: "Lets meet later." },
  ];

  const { createNewChat } = useChat();

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: "100%", padding: 16 }}>
        <Text style={styles.title}>Chat History</Text>
        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text className="text-white text-center">{item.message}</Text>
            </View>
          )}
        />

        {/* bottom buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity className="p-3.5 w-1/2 items-center bg-white/20 rounded-full">
            <HugeiconsIcon icon={Delete01Icon} size={20} color="#f11" />
          </TouchableOpacity>
          <TouchableOpacity onPress={createNewChat} className="p-3.5 w-1/2 items-center bg-white/20 rounded-full">
            <HugeiconsIcon icon={PlusSignIcon} size={20} color="#eee" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14221c",
    borderTopRightRadius: 20,
    padding: 0,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#22c55e",
    textAlign: "center",
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    gap: 8,
  },
});
