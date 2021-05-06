import { useEffect } from "react";
import {
  addColor,
  resetSelectedColor,
  setSelectedColor,
} from "../colorPickerSlice";
import { useIsFocused } from "@react-navigation/native";
import { useAppDispatch } from "../types";

export const usePersistColor = (
  selectedColor: string,
  selectedColorWithLight: string
) => {
  const isScreenFocussed = useIsFocused();
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(selectedColor);
    dispatch(setSelectedColor(selectedColor));
  }, [selectedColor]);

  useEffect(() => {
    if (!isScreenFocussed) {
      dispatch(addColor(selectedColorWithLight));
      dispatch(resetSelectedColor());
    }
  }, [isScreenFocussed]);
};
