import * as React from "react";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LightSlider } from "../components/LightSlider";
import {
  COLOR_PICKER_RADIUS,
  polarToColor,
  circleOffset,
} from "../core/trigonometry";
import { PickerWheel } from "../components/PickerWheel";
import { Colors } from "../components/Colors";
import { useColorPicker } from "../hooks/useColorPicker";

import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const THUMB_RADIUS = 10;

export const NewColorScreen = () => {
  // NOTE: This could be further refactored to single responsibility components(with own state)
  // For the sake of simplicity I decided to not pass state around too much
  const moveX = useSharedValue((COLOR_PICKER_RADIUS * 2) / 1.5);
  const moveY = useSharedValue((COLOR_PICKER_RADIUS * 2) / 1.5);
  const scaleCircle = useSharedValue(1);
  const scaleCircle1 = useSharedValue(1);

  const {
    setSelectedCoordinate,
    setLight,
    selectedColorWithLight,
    selectedColor,
  } = useColorPicker(moveX, moveY);

  const _onMove = useAnimatedGestureHandler({
    onStart: () => {
      scaleCircle.value = withTiming(-0.9, { duration: 200 });
      scaleCircle1.value = withTiming(-0.95, {
        duration: 1000,
        easing: Easing.in(Easing.cubic),
      });
    },
    onActive: (event, _ctx) => {
      moveX.value = event.x;
      moveY.value = event.y;
    },
    onEnd: (event, _ctx) => {
      runOnJS(setSelectedCoordinate)({ x: moveX.value, y: moveY.value });
      scaleCircle.value = withSpring(1);
      scaleCircle1.value = withSpring(1);
    },
  });

  const circleTransformOnPan = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: scaleCircle.value }, { scaleY: scaleCircle.value }],
    };
  });

  const circle1TransformOnPan = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: scaleCircle1.value },
        { scaleY: scaleCircle1.value },
      ],
    };
  });

  const cursorTransformColor = useAnimatedStyle(() => {
    const coordinates = circleOffset(moveX.value, moveY.value);
    return {
      backgroundColor: polarToColor(moveX.value, moveY.value),
      transform: [
        {
          translateX: coordinates.x - THUMB_RADIUS,
        },
        {
          translateY: coordinates.y - THUMB_RADIUS,
        },
      ],
    };
  });

  return (
    <Animated.View style={styles.container}>
      <View style={styles.sheet}>
        <Animated.View style={styles.wheel}>
          <Animated.View
            style={[
              styles.circle,
              { backgroundColor: selectedColorWithLight },
              circleTransformOnPan,
            ]}
          />
          <Animated.View
            style={[
              styles.circle1,
              { backgroundColor: selectedColor },
              circle1TransformOnPan,
            ]}
          />
          <PanGestureHandler onGestureEvent={_onMove}>
            <Animated.View style={[styles.circle2]}>
              <PickerWheel />
              <Animated.View style={[styles.thumb, cursorTransformColor]} />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
        <LightSlider
          color={selectedColor}
          onChange={(value) => {
            setLight(value);
          }}
        />
      </View>
      <Animated.View
        style={[styles.oval, { backgroundColor: selectedColorWithLight }]}
      />
      <Animated.View
        style={[styles.colors, { backgroundColor: selectedColorWithLight }]}
      >
        <Colors
          moveX={moveX}
          moveY={moveY}
          onColorSelect={(x, y) => {
            moveX.value = x;
            moveY.value = y;
            setSelectedCoordinate({
              x,
              y,
            });
          }}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ffffff",
  },
  wheel: {
    width: COLOR_PICKER_RADIUS * 2 + 80,
    height: COLOR_PICKER_RADIUS * 2 + 80,
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    width: COLOR_PICKER_RADIUS * 2 + 80,
    height: COLOR_PICKER_RADIUS * 2 + 80,
    borderRadius: COLOR_PICKER_RADIUS + 80 / 2,
  },
  circle1: {
    ...StyleSheet.absoluteFillObject,
    width: COLOR_PICKER_RADIUS * 2 + 40,
    left: 20,
    top: 20,
    height: COLOR_PICKER_RADIUS * 2 + 40,
    borderRadius: COLOR_PICKER_RADIUS + 40 / 2,
  },
  circle2: {
    ...StyleSheet.absoluteFillObject,
    width: COLOR_PICKER_RADIUS * 2,
    height: COLOR_PICKER_RADIUS * 2,
    left: 40,
    top: 40,
    backgroundColor: "gray",
    borderRadius: COLOR_PICKER_RADIUS,
  },
  sheet: {
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 4,
  },
  oval: {
    width: 50,
    height: 25,
    borderBottomStartRadius: 25,
    borderBottomRightRadius: 25,
    left: windowWidth / 2 - 25,
    transform: [{ scaleX: windowWidth / 50 }, { rotate: "180deg" }],
  },
  thumb: {
    ...StyleSheet.absoluteFillObject,
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 2,
    borderColor: "white",
  },
  colors: {
    flex: 1,
    justifyContent: "center",
  },
});
