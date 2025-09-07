import { useState, useEffect, createContext, useContext } from "react";

export const ChatContext = createContext();
import { getToken } from "./saveToken.js";
import axios from "axios";
import { BASE_URL } from "./auth.js";

export const ChatProvider = ({ children }) => {
  const [chatTitle, setChatTitle] = useState("New Chat");
  const [chatId, setChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const getChats = async () => {
    const token = await getToken();
    try {
      const res = axios.get(`%{BASE_URL}/chats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setChatHistory(res.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async () => {
    const token = await getToken();
    try {
      const res = await axios.post(`${BASE_URL}/chats`, {
        headers: {
          Authentication: `Bearer ${token}`,
        },
      });
      setChatId(res.data.id);
    } catch (error) {
      console.error("Error creating new chat:", error);
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
        messages,
        setMessages,
        inputMessage,
        setInputMessage,
        createNewChat,
        getChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
