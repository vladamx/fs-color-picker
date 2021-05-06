import { Image } from "react-native";
import * as React from "react";
import { COLOR_PICKER_RADIUS } from "../core/trigonometry";

export const PickerWheel = () => {
  return (
    <Image
      style={{
        width: COLOR_PICKER_RADIUS * 2,
        height: COLOR_PICKER_RADIUS * 2,
        transform: [
          {
            rotate: "180deg",
          },
        ],
      }}
      source={require("../assets/images/picker.png")}
    />
  );
};
