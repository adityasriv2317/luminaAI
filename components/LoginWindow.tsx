import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { BASE_URL } from "../constants/auth";

export default function LoginWindow() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!emailOrUsername || !password) {
      setError("Email/Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      let body;
      if (emailOrUsername.includes("@")) {
        body = { email: emailOrUsername, password };
      } else {
        body = { username: emailOrUsername, password };
      }
      const res = await axios.post(`${BASE_URL}/login`, body);
      // Save username to local storage and navigate to home
      const uname =
        body.username || (res.data && res.data.username) || emailOrUsername;
      await AsyncStorage.setItem("username", uname);
      await AsyncStorage.setItem("welcomeScreenShown", "true");
      router.replace("/");
    } catch (err: any) {
      let msg = "Login failed. Please try again.";
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        msg = err.response.data.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-4 py-2">
      <Text className="text-3xl font-extrabold text-emerald-400 mb-8 text-center tracking-tight drop-shadow-lg">
        Login
      </Text>
      <View className="mb-5 flex-row items-center bg-emerald-950/70 rounded-full px-5 py-2 border border-emerald-800/60 shadow-md">
        <Feather
          name="mail"
          size={22}
          color="#6ee7b7"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 h-12 text-center text-emerald-100 text-base"
          placeholder="Email or Username"
          placeholderTextColor="#6ee7b7"
          autoCapitalize="none"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
          style={{ borderRadius: 9999, paddingLeft: 0 }}
          accessibilityLabel="Email or Username"
        />
      </View>
      <View className="mb-2 flex-row items-center bg-emerald-950/70 rounded-full px-5 py-2 border border-emerald-800/60 shadow-md">
        <Feather
          name="lock"
          size={22}
          color="#6ee7b7"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 h-12 text-center text-emerald-100 text-base"
          placeholder="Password"
          placeholderTextColor="#6ee7b7"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={{ borderRadius: 9999, paddingLeft: 0 }}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#6ee7b7"
          />
        </TouchableOpacity>
      </View>
      {error ? (
        <Text className="text-red-400 text-center mb-2 font-semibold">
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        className="w-full h-12 bg-emerald-500 rounded-full items-center justify-center mt-6 shadow-lg flex-row"
        style={{ elevation: 3 }}
        activeOpacity={0.85}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-2xl font-bold tracking-wide">
            Login
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
