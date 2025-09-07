import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  useColorScheme,
} from "react-native";

const materialColors = {
  light: {
    surfaceContainer: "#ECEEEF", // Dialog background
    onSurface: "#1B1C1D", // Title text
    onSurfaceVariant: "#444748", // Message text
    primary: "#00677F", // Button text
    error: "#B3261E", // Destructive button text
    outline: "#747779",
  },
  dark: {
    surfaceContainer: "#2F3032",
    onSurface: "#E2E2E3",
    onSurfaceVariant: "#C4C7C8",
    primary: "#5DD5FC",
    error: "#F2B8B5",
    outline: "#8E9192",
  },
};

export default function CustomAlert({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}) {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <View style={styles.alertBox} onStartShouldSetResponder={() => true}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{title}</Text>
            {message && <Text style={styles.message}>{message}</Text>}
          </View>

          <View style={styles.buttonContainer}>
            {buttons.map((btn, index) => (
              <View key={index} style={styles.buttonWrapper}>
                <Pressable
                  style={styles.button}
                  onPress={btn.onPress}
                  android_ripple={{
                    color: isDarkMode
                      ? materialColors.dark.onSurface
                      : materialColors.light.onSurface,
                    borderless: false,
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      btn.style === "destructive" &&
                        styles.destructiveButtonText,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const getStyles = (isDarkMode) => {
  const theme = isDarkMode ? materialColors.dark : materialColors.light;
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    alertBox: {
      width: "85%",
      maxWidth: 320,
      borderRadius: 28, // Material 3 uses a larger border radius
      elevation: 24,
      backgroundColor: theme.surfaceContainer,
    },
    contentContainer: {
      padding: 24,
    },
    buttonWrapper: {
      borderRadius: 25,
      overflow: "hidden",
      marginLeft: 8,
    },
    title: {
      fontSize: 24,
      fontFamily: "sans-serif", // Android default
      fontWeight: "500",
      color: theme.onSurface,
    },
    message: {
      fontSize: 14,
      fontFamily: "sans-serif",
      color: theme.onSurfaceVariant,
      marginTop: 16,
      lineHeight: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "flex-end", // Buttons are aligned to the right
      paddingHorizontal: 16,
      paddingBottom: 16,
      paddingTop: 8,
    },
    button: {
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: "#515158",
    },
    buttonText: {
      fontSize: 14,
      fontFamily: "sans-serif-medium",
      fontWeight: "600",
      color: theme.primary,
      textTransform: "uppercase",
    },
    destructiveButtonText: {
      color: theme.error,
    },
  });
};
