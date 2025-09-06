import { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  paragraph: {
    marginBottom: 10,
  },
  bulletContainer: {
    flexDirection: "row",
    marginBottom: 5,
    paddingLeft: 10, // Indent bullet points
  },
  bullet: {
    marginRight: 8,
    fontSize: 16,
    lineHeight: 24, // Adjust for vertical alignment with text
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});

/**
 * A component to display text with simple formatting (**bold**, *italic*, bullets).
 * It parses a string and renders it with appropriate styles.
 * @param {{ text: string, style?: object }} props
 */
const FormattedText = ({ text, style }) => {
  // useMemo ensures the parsing logic only runs when the text prop changes.
  const parsedContent = useMemo(() => {
    if (!text || typeof text !== "string") {
      return [];
    }

    // 1. Split text into paragraphs based on newlines
    const paragraphs = text.split("\n");

    return paragraphs
      .map((paragraphText, pIndex) => {
        const trimmedText = paragraphText.trim();

        // 2. Check if the paragraph is a bullet point
        const isBullet = trimmedText.startsWith("* ");
        const contentText = isBullet ? trimmedText.substring(2) : trimmedText;

        if (contentText === "") {
          return null; // Don't render empty lines
        }

        // 3. Split each paragraph into chunks of normal, bold, or italic text
        // The regex splits the string by the markers but keeps the markers in the array
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

        // 4. Return the correct JSX structure for a paragraph or a bullet point
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
      .filter(Boolean); // Clean up any null entries from empty lines
  }, [text, style]);

  return <View>{parsedContent}</View>;
};

export default FormattedText;
