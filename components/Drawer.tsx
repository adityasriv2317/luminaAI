import { useChat } from "@/constants/chatContext";
import { Delete01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "./Alert";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export function ChatDrawer() {
  const [deleteAlert, setDeleteAlert] = useState(false);
  const {
    createNewChat,
    chatHistory,
    handleClearChats,
    isLoading,
    getChats,
    setChatTitle,
  } = useChat();

  const alertButtons = [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => setDeleteAlert(false),
    },
    {
      text: "Delete",
      style: "destructive",
      onPress: () => {
        setDeleteAlert(false);
        handleClearChats();
      },
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1, width: "100%", padding: 16 }}>
        <Text style={styles.title}>Chat History</Text>
        {isLoading && (
          <View className="flex-row justify-center items-center my-4">
            <ActivityIndicator size="large" color="#22c55e" />
          </View>
        )}
        {/* chat list */}
        <FlatList
          data={chatHistory}
          keyExtractor={(item, i) => i.toString()}
          contentContainerStyle={styles.flatList}
          inverted
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.listText}>{item.title}</Text>
            </View>
          )}
        />

        {/* bottom buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            onPress={() => setDeleteAlert(true)}
            className="p-3.5 w-1/2 items-center bg-white/20 rounded-full"
          >
            <HugeiconsIcon icon={Delete01Icon} size={20} color="#f11" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              createNewChat();
              setChatTitle("New Chat");
              getChats();
            }}
            className="p-3.5 w-1/2 items-center bg-white/20 rounded-full"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={20} color="#eee" />
          </TouchableOpacity>
        </View>

        <CustomAlert
          visible={deleteAlert}
          title={"Delete History"}
          message={"Do you want to delete all chats?"}
          onDismiss={() => setDeleteAlert(false)}
          buttons={alertButtons}
        />
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
    padding: 14,
    backgroundColor: "#103323",
    marginTop: 12,
    borderRadius: 999,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    gap: 8,
  },
  listText: {
    color: "#eee",
    textAlign: "center",
    fontSize: 18,
  },
  flatList: { flex: 1, marginTop: 20 },
});
