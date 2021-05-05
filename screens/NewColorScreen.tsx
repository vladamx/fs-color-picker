import * as React from "react";
import { View, StyleSheet, Dimensions, Image } from "react-native";
import Constants from "expo-constants";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { range as lodashRange } from "lodash-es";
import { LightSlider } from "./LightSlider";
import { useEffect, useMemo, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch } from "../types";
import {
  addColor,
  resetSelectedColor,
  setSelectedColor,
} from "../colorPickerSlice";

const windowWidth = Dimensions.get("window").width;

const DEFAULT_COLORS_NUM = 5;
const THUMB_RADIUS = 10;

const COLOR_PICKER_RADIUS = windowWidth / 3.5;

const range = (value: number, start: number, end: number) => {
  "worklet";
  if (value < start) {
    return start;
  } else if (value > end) {
    return end;
  } else {
    return value;
  }
};

const cartesianToPolar = (x: number, y: number) => {
  "worklet";
  const radius = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return {
    radius,
    theta: (Math.atan2(y, x) * 180) / Math.PI,
  };
};

const radius = (
  xOffset: number,
  yOffset: number,
  circleRadius = COLOR_PICKER_RADIUS
) => {
  "worklet";
  const x = range(xOffset, 0, circleRadius * 2);
  const y = range(yOffset, 0, circleRadius * 2);
  const radius = Math.sqrt(
    Math.pow(x - circleRadius, 2) + Math.pow(y - circleRadius, 2)
  );
  if (radius >= circleRadius) {
    const normalizedX = Math.sqrt(
      Math.pow(COLOR_PICKER_RADIUS, 2) - Math.pow(Math.abs(y - circleRadius), 2)
    );
    return {
      x:
        xOffset < circleRadius
          ? Math.abs(normalizedX - circleRadius)
          : normalizedX + circleRadius,
      y: y,
    };
  } else {
    return { x, y };
  }
};

const polarToColor = (
  x: number,
  y: number,
  { hueOffset = 0, light = 1 } = { hueOffset: 0, light: 1 }
) => {
  "worklet";
  const coordinates = radius(x, y);
  const polar = cartesianToPolar(
    coordinates.x - COLOR_PICKER_RADIUS,
    coordinates.y - COLOR_PICKER_RADIUS
  );
  const theta = polar.theta < 0 ? 360 + polar.theta : polar.theta;
  return `hsla(${Math.round(theta + hueOffset)}, ${Math.round(
    polar.radius
  )}%, 60%, ${light})`;
};

export const NewColorScreen = () => {
  const moveX = useSharedValue(styles.circle2.width / 1.5);
  const moveY = useSharedValue(styles.circle2.height / 1.5);
  const [light, setLight] = useState(0.5);
  const isFocussed = useIsFocused();
  const dispatch = useAppDispatch();
  const [selectedCoordinate, setSelectedCoordinate] = useState({
    x: moveX.value,
    y: moveY.value,
  });
  const _onMove = useAnimatedGestureHandler({
    onActive: (event, _ctx) => {
      moveX.value = event.x;
      moveY.value = event.y;
    },
    onEnd: (event, _ctx) => {
      runOnJS(setSelectedCoordinate)({ x: moveX.value, y: moveY.value });
    },
  });

  const selectedColor = useMemo(() => {
    return polarToColor(moveX.value, moveY.value);
  }, [selectedCoordinate]);

  useEffect(() => {
    console.log(selectedColor);
    dispatch(setSelectedColor(selectedColor));
  }, [selectedColor]);

  const selectedColorWithLight = useMemo(() => {
    return polarToColor(moveX.value, moveY.value, { light });
  }, [selectedColor, light]);

  const cursorTransformColor = useAnimatedStyle(() => {
    const coordinates = radius(moveX.value, moveY.value);
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

  useEffect(() => {
    if (!isFocussed) {
      dispatch(addColor(selectedColorWithLight));
      dispatch(resetSelectedColor());
    }
  }, [isFocussed]);

  return (
    <Animated.View style={styles.container}>
      <View style={styles.sheet}>
        <Animated.View style={styles.wheel}>
          <Animated.View
            style={[styles.circle, { backgroundColor: selectedColorWithLight }]}
          />
          <Animated.View
            style={[styles.circle1, { backgroundColor: selectedColor }]}
          />
          <PanGestureHandler onGestureEvent={_onMove}>
            <Animated.View style={[styles.circle2]}>
              <Image
                style={{
                  width: styles.circle2.width,
                  height: styles.circle2.height,
                  transform: [
                    {
                      rotate: "180deg",
                    },
                  ],
                }}
                source={require("../assets/images/picker.png")}
              />
              <Animated.View
                style={[
                  {
                    ...StyleSheet.absoluteFillObject,
                    width: THUMB_RADIUS * 2,
                    height: THUMB_RADIUS * 2,
                    borderRadius: THUMB_RADIUS,
                    borderWidth: 2,
                    borderColor: "white",
                  },
                  cursorTransformColor,
                ]}
              />
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
        style={[styles.colors, { backgroundColor: selectedColorWithLight }]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {lodashRange(0, DEFAULT_COLORS_NUM).map((index) => {
            return (
              <Dot key={index} index={index} moveX={moveX} moveY={moveY} />
            );
          })}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const Dot = ({
  index,
  moveX,
  moveY,
}: {
  index: number;
  moveX: Animated.SharedValue<number>;
  moveY: Animated.SharedValue<number>;
}) => {
  const dotColor = useAnimatedStyle(() => {
    return {
      backgroundColor: polarToColor(moveX.value, moveY.value, {
        hueOffset: index * (360 / DEFAULT_COLORS_NUM),
      }),
    };
  });
  return <Animated.View style={[styles.dot, dotColor]} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ffffff",
  },
  dot: {
    width: 45,
    height: 45,
    borderColor: "white",
    borderWidth: 1,
    backgroundColor: "red",
    borderRadius: 45 / 2,
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
  colors: {
    flex: 1,
    justifyContent: "center",
  },
});
