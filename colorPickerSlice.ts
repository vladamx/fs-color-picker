import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  selectedColor: string;
  colors: string[];
}

const DEFAULT_COLOR = "hsla(45, 56%, 60%, 1)";

const initialState: CounterState = {
  selectedColor: DEFAULT_COLOR,
  colors: [],
};

export const colorPickerSlice = createSlice({
  name: "colorPicker",
  initialState,
  reducers: {
    resetSelectedColor: (state) => {
      state.selectedColor = DEFAULT_COLOR;
    },
    setSelectedColor: (state, { payload }: PayloadAction<string>) => {
      state.selectedColor = payload;
    },
    addColor: (state, { payload }: PayloadAction<string>) => {
      state.colors.push(payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSelectedColor,
  addColor,
  resetSelectedColor,
} = colorPickerSlice.actions;

export default colorPickerSlice.reducer;
