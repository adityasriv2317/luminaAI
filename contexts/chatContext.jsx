import { useState, useEffect, createContext, useContext } from "react";
import { getToken } from "../constants/saveToken";
import { fetchChats, createChat } from "../constants/chats";

const chatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const token = getToken();

  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const LoadChats = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetchChats();
      setChats(res.data);
    } catch (err) {
      console.log("Error fetching chats", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await createChat();
      const newChat = res.data;
      setChats((prevChats) => [newChat, ...prevChats]);
      return newChat;
    } catch (err) {
      console.log("Error creating chat", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <chatContext.Provider value={{ chats, loadChats, createNewChat, isLoading }}>
      {children}
    </chatContext.Provider>
  );
};
