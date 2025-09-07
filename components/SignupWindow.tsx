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
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.inputContainer}>
        <Feather name="user" size={22} color="#22c55e" />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#9ca3af"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={22} color="#22c55e" />
        <TextInput
          style={styles.input}
          placeholder="Email ID"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
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

      <View style={styles.inputContainer}>
        <Feather name="lock" size={22} color="#22c55e" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
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
    backgroundColor: "#16241e",
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
