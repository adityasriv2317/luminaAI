import axios from "axios";
import { createContext, useContext, useState } from "react";
import { BASE_URL } from "./auth.js";
import { getToken } from "./saveToken.js";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [chat, setChat] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const getChats = async () => {
    const token = await getToken();
    try {
      setIsLoading(true);
      //   console.log(token);
      const res = await axios.get(`${BASE_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    const token = await getToken();
    try {
      const res = await axios.post(
        `${BASE_URL}/chats`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChatId(res.data.chatId);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleClearChats = async () => {
    const token = await getToken();
    try {
      setIsLoading(true);
      await axios.delete(`${BASE_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory([]);
      createNewChat();
      setChatTitle("New Chat");
      setChat([]);
    } catch (error) {
      console.error("Error deleting chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatTitle,
        setChatTitle,
        chatId,
        setChatId,
        chatHistory,
        setChatHistory,
        isLoading,
        setIsLoading,
        chat,
        setChat,
        inputMessage,
        setInputMessage,
        createNewChat,
        getChats,
        handleClearChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
