import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import * as React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const SLIDER_WIDTH = 160;
const THUMB_WIDTH = 20;
const THUMB_RADIUS = THUMB_WIDTH / 2;

const sliderRange = (x: number) => {
  "worklet";
  return x > SLIDER_WIDTH
    ? SLIDER_WIDTH
    : x <= THUMB_WIDTH
    ? 0
    : x - THUMB_RADIUS;
};

export const LightSlider = ({
  color,
  onChange = () => {},
}: {
  color: string;
  onChange?: (value: number) => void;
}) => {
  const sliderMoveX = useSharedValue(SLIDER_WIDTH / 2 + THUMB_RADIUS);
  const _onSliderMove = useAnimatedGestureHandler({
    onActive: (event, _ctx) => {
      sliderMoveX.value = event.x;
    },
    onEnd: (event, _ctx) => {
      const value = (sliderRange(sliderMoveX.value) * 100) / 160 / 100;
      runOnJS(onChange)(1 - value);
    },
  });

  const thumbTransformColor = useAnimatedStyle(() => {
    return {
      backgroundColor: color,
      transform: [
        {
          translateX: sliderRange(sliderMoveX.value),
        },
      ],
    };
  });

  return (
    <Animated.View style={{ flexDirection: "row" }}>
      <MaterialCommunityIcons
        color={color}
        name="lightbulb"
        size={28}
        style={[{ marginHorizontal: 20, marginVertical: -12 }]}
      />
      <PanGestureHandler onGestureEvent={_onSliderMove}>
        <Animated.View style={[styles.slider, { backgroundColor: color }]}>
          <LinearGradient
            colors={["black", "black", "transparent"]}
            start={{ x: -1, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.slider}
          />
          <Animated.View style={[styles.thumb, thumbTransformColor]} />
        </Animated.View>
      </PanGestureHandler>
      <MaterialCommunityIcons
        color={color}
        name="lightbulb-on-outline"
        size={28}
        style={[{ marginHorizontal: 20, marginVertical: -14 }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  thumb: {
    ...StyleSheet.absoluteFillObject,
    width: THUMB_WIDTH,
    height: 20,
    borderRadius: 20 / 2,
    top: -7.5,
    left: -10,
  },
  slider: {
    width: SLIDER_WIDTH,
    height: 5,
    borderRadius: 2.5,
  },
});
