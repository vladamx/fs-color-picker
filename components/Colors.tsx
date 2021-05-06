import { range as lodashRange } from "lodash-es";
import { Pressable, View, StyleSheet } from "react-native";
import * as React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import {
  offsetToPolar,
  polarToCartesian,
  polarToColor,
} from "../core/trigonometry";

const DEFAULT_COLORS_NUM = 5;

export const Colors = ({
  moveX,
  moveY,
  onColorSelect,
}: {
  moveX: Animated.SharedValue<number>;
  moveY: Animated.SharedValue<number>;
  onColorSelect: (theta: number, radius: number) => void;
}) => {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
      {lodashRange(0, DEFAULT_COLORS_NUM).map((index) => {
        return (
          <Dot
            onSelect={onColorSelect}
            key={index}
            index={index}
            moveX={moveX}
            moveY={moveY}
          />
        );
      })}
    </View>
  );
};

const Dot = ({
  index,
  moveX,
  moveY,
  onSelect,
}: {
  index: number;
  moveX: Animated.SharedValue<number>;
  moveY: Animated.SharedValue<number>;
  onSelect: (theta: number, radius: number) => void;
}) => {
  const hueOffset = index * (360 / DEFAULT_COLORS_NUM);
  const dotColor = useAnimatedStyle(() => {
    return {
      backgroundColor: polarToColor(moveX.value, moveY.value, {
        hueOffset,
      }),
    };
  });

  return (
    <Pressable
      onPress={() => {
        const polar = offsetToPolar(moveX.value, moveY.value);
        const coordinates = polarToCartesian(
          polar.theta + hueOffset,
          polar.radius
        );
        onSelect(coordinates.x, coordinates.y);
      }}
    >
      <Animated.View style={[styles.dot, dotColor]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 45,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 45 / 2,
  },
});
