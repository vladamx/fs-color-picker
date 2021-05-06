import { useMemo, useState } from "react";
import { polarToColor } from "../core/trigonometry";
import Animated from "react-native-reanimated";
import { usePersistColor } from "./usePersistColor";

export const useColorPicker = (
  moveX: Animated.SharedValue<number>,
  moveY: Animated.SharedValue<number>
) => {
  const [selectedCoordinate, setSelectedCoordinate] = useState({
    x: moveX.value,
    y: moveY.value,
  });
  const [light, setLight] = useState(0.5);

  const selectedColor = useMemo(() => {
    return polarToColor(moveX.value, moveY.value);
  }, [selectedCoordinate]);

  const selectedColorWithLight = useMemo(() => {
    return polarToColor(moveX.value, moveY.value, { light });
  }, [selectedColor, light]);

  usePersistColor(selectedColor, selectedColorWithLight);

  return {
    selectedColor,
    selectedColorWithLight,
    setSelectedCoordinate,
    setLight,
  };
};
