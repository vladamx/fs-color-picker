import * as React from "react";
import { View, Text, Pressable } from "react-native";
import { FlatList, StyleSheet } from "react-native";
import { useAppSelector } from "../types";
import { useNavigation } from "@react-navigation/native";
import { NewColorNavigationProp } from "../components/AddColorButton";

const ListEmpty = () => {
  const navigation = useNavigation<NewColorNavigationProp>();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
      }}
    >
      <Text>There is no colors in your colors list.</Text>
      <Pressable
        style={{ marginTop: 10 }}
        onPress={() => {
          navigation.navigate("NewColor");
        }}
      >
        <Text style={{ color: "blue" }}>Add color</Text>
      </Pressable>
    </View>
  );
};

export const ColorsScreen = () => {
  const favoriteColors = useAppSelector((store) => store.colorPicker.colors);
  return (
    <FlatList
      data={favoriteColors}
      keyExtractor={(_item, index) => {
        return `color-${index}`;
      }}
      ListEmptyComponent={ListEmpty}
      renderItem={({ item, index }) => (
        <View key={index} style={[styles.item, { backgroundColor: item }]}>
          <View style={[{ backgroundColor: "black" }]}>
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {item}
            </Text>
          </View>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    margin: 20,
    flex: 1,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
});
