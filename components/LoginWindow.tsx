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
import { BASE_URL } from "@/constants/auth";
import { saveToken } from "@/constants/saveToken";

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
      if (res.data.token) {
        await saveToken(res.data.token);
      }
      const uname =
        body.username || (res.data && res.data.username) || emailOrUsername;
      // console.log(res.data);
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
      // console.log(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Feather name="user" size={22} color="#22c55e" />
        <TextInput
          style={styles.input}
          placeholder="Email or Username"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="lock" size={22} color="#22c55e" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
          <Feather
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#22c55e"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#22c55e",
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#103323",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#22c55e40",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#e5e7eb",
    paddingLeft: 8,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#02952e",
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
} as const;
