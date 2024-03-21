/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from "react";
import { StyleSheet, View } from "react-native";

// import components
import Icon from "./Icon";
import TouchableItem from "./TouchableItem";

// HeaderIconButton Styles
const styles = StyleSheet.create({
  androidButtonWrapper: {
    marginHorizontal: 13,
    backgroundColor: "transparent"
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  icon: {
    height: 24,
    width: 24,
    margin: 3,         
    justifyContent: "center",
    alignItems: "center"
  }
});

const renderIcon = (name, size, color) => (
  <View style={styles.icon}>
    <Icon name={name} size={size} color={color} />
  </View>
);

const HeaderIconButton = props => {
  const {
    onPress = () => null,
    rippleColor = "rgba(0, 0, 0, 0.32)",
    name,
    size = 24,
    color = "rgba(0, 0, 0, 0.52)" 
  } = props;

  const button = (
    <TouchableItem
      accessibilityComponentType="button"
      accessibilityTraits="button"
      delayPressIn={0}
      onPress={onPress}
      rippleColor={rippleColor}
      style={styles.container}
      borderless
    >
      {renderIcon(name, size, color)}
    </TouchableItem>
  );


  return <View style={styles.androidButtonWrapper}>{button}</View>;
 
};

export default HeaderIconButton;
