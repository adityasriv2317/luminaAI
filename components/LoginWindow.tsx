import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LoginWindow() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	return (
		<View className="px-4 py-2">
			<Text className="text-2xl font-bold text-emerald-400 mb-6 text-center">Login</Text>
			<View className="mb-4 flex-row items-center bg-emerald-950/60 rounded-lg px-4 border border-emerald-800/60">
				<Feather name="mail" size={20} color="#6ee7b7" style={{ marginRight: 8 }} />
				<TextInput
					className="flex-1 h-12 text-emerald-100"
					placeholder="Email"
					placeholderTextColor="#6ee7b7"
					keyboardType="email-address"
					autoCapitalize="none"
					value={email}
					onChangeText={setEmail}
				/>
			</View>
			<View className="mb-2 flex-row items-center bg-emerald-950/60 rounded-lg px-4 border border-emerald-800/60">
				<Feather name="lock" size={20} color="#6ee7b7" style={{ marginRight: 8 }} />
				<TextInput
					className="flex-1 h-12 text-emerald-100"
					placeholder="Password"
					placeholderTextColor="#6ee7b7"
					secureTextEntry={!showPassword}
					value={password}
					onChangeText={setPassword}
				/>
				<TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
					<Feather name={showPassword ? "eye-off" : "eye"} size={20} color="#6ee7b7" />
				</TouchableOpacity>
			</View>
			<TouchableOpacity className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-lg items-center justify-center mt-4" style={{ elevation: 2 }}>
				<Text className="text-emerald-50 text-lg font-semibold tracking-wide">Login</Text>
			</TouchableOpacity>
		</View>
	);
}
