import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";

/**
 * A sleek, modern typing indicator component for React Native.
 * It displays three animated dots that bounce in a staggered sequence,
 * simulating a "typing" effect.
 *
 * @component
 * @example
 * return <TypingIndicator />
 */
const TypingIndicator = () => {
  // Use `useRef` to store animated values to prevent them from
  // being re-initialized on every render.
  const dot1Opacity = useRef(new Animated.Value(0.5)).current;
  const dot2Opacity = useRef(new Animated.Value(0.5)).current;
  const dot3Opacity = useRef(new Animated.Value(0.5)).current;

  // `useEffect` to start the animation when the component mounts.
  useEffect(() => {
    // Defines the animation for a single dot.
    // It's a sequence of fading in (opacity 1) and fading out (opacity 0.5).
    const createAnimation = (animatedValue) => {
      return Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.5,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
    };

    // Create a looping animation that staggers the animation of each dot.
    // The stagger delay creates the "wave" effect.
    const animation = Animated.loop(
      Animated.stagger(200, [
        createAnimation(dot1Opacity),
        createAnimation(dot2Opacity),
        createAnimation(dot3Opacity),
      ])
    );

    // Start the animation.
    animation.start();

    // Cleanup function to stop the animation when the component unmounts.
    return () => {
      animation.stop();
    };
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
    </View>
  );
};

// StyleSheet for the component.
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8e8e8e", // A neutral grey color for the dots
    marginHorizontal: 3,
  },
});

export default TypingIndicator;
