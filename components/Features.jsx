import React from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
// --- UPDATED: Import icons from Hugeicons ---
import {
  Rocket01,
  Language,
  Code02,
  ShieldTick,
} from "@hugeicons/react-native-pro";

// --- UPDATED: Data for the Carousel with new icons ---
const FEATURES_DATA = [
  {
    id: "1",
    icon: (props) => <Rocket01 {...props} />, // Replaced Zap
    title: "Instant Answers",
    description:
      "Get lightning-fast, accurate responses to your queries in real-time.",
    color: "#6F4E9A", // A shade of purple
  },
  {
    id: "2",
    icon: (props) => <Language {...props} />, // Replaced Languages
    title: "Multi-Language Support",
    description: "Converse and get answers in over 50 languages seamlessly.",
    color: "#4A90E2", // A shade of blue
  },
  {
    id: "3",
    icon: (props) => <Code02 {...props} />, // Replaced Code2
    title: "Code Generation",
    description:
      "Generate, debug, and explain code snippets in any programming language.",
    color: "#50E3C2", // A shade of teal
  },
  {
    id: "4",
    icon: (props) => <ShieldTick {...props} />, // Replaced ShieldCheck
    title: "Secure & Private",
    description:
      "Your conversations are encrypted and your data is never shared.",
    color: "#D0021B", // A shade of red
  },
];

// --- Single Feature Item Component (No changes here) ---
const FeatureItem = ({ item, index, scrollX }) => {
  const { width } = useWindowDimensions();
  // We can pass the variant prop for Hugeicons here if needed, e.g., variant="stroke"
  const iconSize = width * 0.3;

  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.2, 1, 0.2],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, 50],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width }]}>
      <Animated.View style={[styles.itemContent, animatedStyle]}>
        {/* The 'variant' prop can be 'stroke', 'solid', 'bulk', etc. */}
        {item.icon({ color: item.color, size: iconSize, variant: "bulk" })}
        <Text style={[styles.title, { color: item.color }]}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    </View>
  );
};

// --- Paginator Component (No changes here) ---
const Paginator = ({ data, scrollX }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.paginatorContainer}>
      {data.map((_, i) => {
        const animatedDotStyle = useAnimatedStyle(() => {
          const inputRange = [(i - 1) * width, i * width, (i + 1) * width];

          const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [10, 25, 10],
            Extrapolate.CLAMP
          );

          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.3, 1, 0.3],
            Extrapolate.CLAMP
          );

          return {
            width: dotWidth,
            opacity,
          };
        });

        return (
          <Animated.View
            key={i.toString()}
            style={[styles.dot, animatedDotStyle]}
          />
        );
      })}
    </View>
  );
};

// --- Main Carousel Component (No changes here) ---
export default function Features() {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={FEATURES_DATA}
        renderItem={({ item, index }) => (
          <FeatureItem item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      />
      <Paginator data={FEATURES_DATA} scrollX={scrollX} />
    </View>
  );
}

// --- Styles (No changes here) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f7",
  },
  itemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  itemContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6e6e73",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  paginatorContainer: {
    flexDirection: "row",
    height: 64,
    position: "absolute",
    bottom: 40,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A90E2",
    marginHorizontal: 8,
  },
});
