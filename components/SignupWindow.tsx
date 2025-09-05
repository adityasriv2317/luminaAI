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
import BASE_URL from "../constants/auth";

export default function SignupWindow() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!username || !email || !password || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/signup`, {
        username,
        email,
        password,
      });
      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("welcomeScreenShown", "true");
      router.replace("/");
    } catch (err: any) {
      let msg = "Signup failed. Please try again.";
      if (err?.response?.data?.message) {
        msg = err.response.data.message;
      }
      setError(err.response?.data?.message || msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-4 py-2">
      <Text className="text-3xl font-extrabold text-emerald-400 mb-8 text-center tracking-tight drop-shadow-lg">
        Sign Up
      </Text>
      {/* Username */}
      <View className="mb-4 flex-row items-center bg-emerald-950/70 rounded-full px-5 py-2 border border-emerald-800/60 shadow-md">
        <Feather
          name="user"
          size={22}
          color="#6ee7b7"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 h-12 text-center text-emerald-100 text-base"
          placeholder="Username"
          placeholderTextColor="#6ee7b7"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
          style={{ borderRadius: 9999, paddingLeft: 0 }}
        />
      </View>
      {/* Email */}
      <View className="mb-5 flex-row items-center bg-emerald-950/70 rounded-full px-5 py-2 border border-emerald-800/60 shadow-md">
        <Feather
          name="mail"
          size={22}
          color="#6ee7b7"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 h-12 text-center text-emerald-100 text-base"
          placeholder="Email ID"
          placeholderTextColor="#6ee7b7"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={{ borderRadius: 9999, paddingLeft: 0 }}
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
          placeholder="     Password"
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
      <View className="mb-2 flex-row items-center bg-emerald-950/70 rounded-full px-5 py-2 border border-emerald-800/60 shadow-md">
        <Feather
          name="lock"
          size={22}
          color="#6ee7b7"
          style={{ marginRight: 10 }}
        />
        <TextInput
          className="flex-1 h-12 text-center text-emerald-100 text-base"
          placeholder="Confirm Password"
          placeholderTextColor="#6ee7b7"
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
          style={{ borderRadius: 9999, paddingLeft: 0 }}
        />
      </View>
      {error ? (
        <Text className="text-red-400 text-center mb-2 font-semibold">
          {error}
        </Text>
      ) : null}
      <TouchableOpacity
        className="w-full h-12 bg-emerald-500 rounded-full items-center justify-center mt-6 shadow-lg"
        style={{ elevation: 3, flexDirection: "row" }}
        activeOpacity={0.85}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-2xl font-bold tracking-wide">
            Sign Up
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
