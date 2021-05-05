import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { StackNavigationProp } from "@react-navigation/stack";

export type NewColorNavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewColor"
>;

export const AddColorButton = () => {
  const navigation = useNavigation<NewColorNavigationProp>();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("NewColor");
      }}
      style={{ margin: 10 }}
    >
      <Feather name="plus" size={24} color="black" />
    </Pressable>
  );
};
