import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10,
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});

const FormattedText = ({ text, style }) => {
  const parsedContent = useMemo(() => {
    if (!text || typeof text !== "string") {
      return [];
    }

    const paragraphs = text.split("\n");

    return paragraphs
      .map((paragraphText, pIndex) => {
        const trimmedText = paragraphText.trim();

        const isBullet = trimmedText.startsWith("* ");
        const contentText = isBullet ? trimmedText.substring(2) : trimmedText;

        if (contentText === "") {
          return null;
        }

        const chunks = contentText
          .split(/(\*\*.*?\*\*|\*.*?\*)/g)
          .filter(Boolean);

        const styledChunks = chunks.map((chunk, cIndex) => {
          if (chunk.startsWith("**") && chunk.endsWith("**")) {
            return (
              <Text key={cIndex} style={styles.bold}>
                {chunk.slice(2, -2)}
              </Text>
            );
          }
          if (chunk.startsWith("*") && chunk.endsWith("*")) {
            return (
              <Text key={cIndex} style={styles.italic}>
                {chunk.slice(1, -1)}
              </Text>
            );
          }
          return <Text key={cIndex}>{chunk}</Text>;
        });

        if (isBullet) {
          return (
            <View key={pIndex} style={styles.bulletContainer}>
              <Text style={[style, styles.bullet]}>•</Text>
              <Text style={[style, styles.bulletText]}>{styledChunks}</Text>
            </View>
          );
        } else {
          return (
            <Text key={pIndex} style={[style, styles.paragraph]}>
              {styledChunks}
            </Text>
          );
        }
      })
      .filter(Boolean);
  }, [text, style]);

  return <View>{parsedContent}</View>;
};

export default FormattedText;
