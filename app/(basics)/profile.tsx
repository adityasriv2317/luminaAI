import {
  ArrowLeft01Icon,
  Calendar01Icon,
  Logout01Icon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "@/constants/auth";
import { getToken } from "@/constants/saveToken";

import CustomAlert from "@/components/Alert";

export default function ProfileScreen() {
  const [isLogoutAlertVisible, setLogoutAlertVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutAlertVisible(false);

    await AsyncStorage.clear();
    router.replace("/(basics)/Login");
  };

  const logoutButtons = [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => setLogoutAlertVisible(false),
    },
    {
      text: "Logout",
      style: "destructive",
      onPress: handleLogout,
    },
  ];

  const [profile, setProfile] = useState<{
    email: string;
    username: string;
    dateJoined: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const token = await getToken();
        const username = await AsyncStorage.getItem("username");
        // console.log(token);
        if (!username) {
          setError("No username found in local storage.");
          setLoading(false);
          return;
        }
        const res = await axios.get(`${BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: { username },
        });
        setProfile(res.data);
      } catch (err: any) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top App Bar */}
        <View style={styles.topAppBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={26} color="#22c55e" />
          </TouchableOpacity>
          <Text style={styles.topAppBarTitle}>Profile</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeIn.duration(600)} style={styles.card}>
            {loading ? (
              <View style={styles.centered}>
                <ActivityIndicator size="large" color="#22c55e" />
                <Text style={styles.loadingText}>Loading profile…</Text>
              </View>
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : profile ? (
              <Animated.View entering={FadeInDown.duration(400)}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatarCircle}>
                    <HugeiconsIcon icon={UserIcon} size={72} color="#22c55e" />
                  </View>
                  <Text style={styles.username}>@{profile.username}</Text>
                </View>

                {/* Info cards */}
                <View style={styles.infoSection}>
                  {/* Email */}
                  <View style={styles.infoCard}>
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      size={26}
                      color="#a3e635"
                    />
                    <Text style={styles.infoText}>{profile.email}</Text>
                  </View>

                  {/* Date Joined */}
                  <View style={styles.infoCard}>
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      size={26}
                      color="#a3e635"
                    />
                    <Text style={styles.secondaryText}>
                      Joined {new Date(profile.dateJoined).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ) : null}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
      {/* Logout Button (fixed at bottom) */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setLogoutAlertVisible(true)}
        activeOpacity={0.85}
      >
        <HugeiconsIcon icon={Logout01Icon} size={22} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={isLogoutAlertVisible}
        title="Logout"
        message="Are you sure you want to logout?"
        buttons={logoutButtons}
        onDismiss={() => setLogoutAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    position: "absolute",
    bottom: 32,
    left: 24,
    right: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 16,
    shadowColor: "#ef4444",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 100,
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  // Layout
  container: {
    flex: 1,
    backgroundColor: "#10151a",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#000000",
  },

  // Top App Bar
  topAppBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#10151a",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderBottomWidth: 2,
    borderBlockColor: "#ffffff11",
  },
  topAppBarTitle: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginLeft: 8,
  },
  backButton: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: "#16241e",
    marginRight: 4,
  },

  // Card
  card: {
    backgroundColor: "#16241e",
    borderRadius: 32,
    padding: 44,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },

  // Avatar
  avatarContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatarCircle: {
    backgroundColor: "#10151a",
    borderRadius: 100,
    padding: 20,
    borderWidth: 6,
    borderColor: "#22c55e",
    shadowColor: "#22c55e",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 16,
  },

  // Info
  infoSection: {
    gap: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10151a",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: "center",
  },
  infoText: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  secondaryText: {
    color: "#94a3b8",
    fontSize: 15,
    marginLeft: 12,
  },

  // Status
  centered: {
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: "#ef4444",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
