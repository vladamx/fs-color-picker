import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorsScreen } from "./screens/ColorsScreen";
import { NewColorScreen } from "./screens/NewColorScreen";
import { RootStackParamList, useAppSelector } from "./types";
import { AddColorButton } from "./components/AddColorButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Navigation() {
  return (
    <NavigationContainer theme={DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  const selectedColor = useAppSelector(
    (store) => store.colorPicker.selectedColor
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="FavoriteColors"
        component={ColorsScreen}
        options={{
          title: "Colors",
          headerRight: () => {
            return <AddColorButton />;
          },
        }}
      />
      <Stack.Screen
        name="NewColor"
        component={NewColorScreen}
        options={{
          title: "New Color",
          headerBackTitleStyle: {
            color: selectedColor,
          },
          headerBackImage: (_props) => {
            return (
              <MaterialCommunityIcons
                name={"arrow-left"}
                color={selectedColor}
                size={24}
                style={{ marginHorizontal: 10 }}
              />
            );
          },
          headerTitleStyle: {
            color: selectedColor,
          },
        }}
      />
    </Stack.Navigator>
  );
}
