/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/dist/Ionicons";
import FAIcon from "react-native-vector-icons/dist/FontAwesome";

// import components
import { ButtonText } from "../text/CustomText";
import TouchableItem from "../TouchableItem";

// import colors
import Colors from "../../theme/colors";

// ContainedButton Config
const BUTTON_BORDER_RADIUS = 4;
const BUTTON_HEIGHT = 48;
const BUTTON_WIDTH = "100%";

const styles = StyleSheet.create({
  container: {
    borderRadius: BUTTON_BORDER_RADIUS,
    backgroundColor: Colors.primaryColor,
    elevation: 2,
    overflow: "hidden"
  },
  containedButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    maxWidth: BUTTON_WIDTH,
    height: BUTTON_HEIGHT
  },
  rounded: {
    borderRadius: BUTTON_HEIGHT / 2
  },
  socialIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginRight: 12
  },
  iconContainer: {
    marginLeft: 12  
  },
  title: {
    paddingHorizontal: 16,
    color: Colors.onPrimaryColor,
    textAlign: "center"
  }

});

const ContainedButton = ({
  onPress,
  activeOpacity = 0.85,
  height,
  borderRadius,
  color,
  iconColor,
  iconName,
  socialIconName,
  title,
  titleColor,
  rounded,
  titleStyle,
  disabled = false,
  borderWidth,
  borderColor,
  width,
  indicatorShow
}) => (
  <View
    style={[
      styles.container,
      color && { backgroundColor: color },
      borderRadius && { borderRadius },
      rounded && styles.rounded,
      height && rounded && { borderRadius: height / 2 },
      borderWidth && { borderWidth },
      borderColor && { borderColor },
      width && { width }
    ]}
  >
    <TouchableItem
      onPress={!disabled && onPress}
      activeOpacity={activeOpacity}
      disabled={disabled}
    >
      <View style={[styles.containedButton, height && { height }]}>
        {socialIconName && (
          <View style={styles.socialIconContainer}>
            <FAIcon name={socialIconName} size={26} color={iconColor} />
          </View>
        )}
        {iconName && (
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={18} color={iconColor} />
          </View>
        )}
        {indicatorShow &&
          <ActivityIndicator size="small" color="#fff" />
        }
        <ButtonText
          style={[styles.title, titleStyle, titleColor && { color: titleColor }, iconName && { paddingLeft: 8 }]}
        >
          {title !== undefined ? title.toUpperCase() : "BUTTON"}
        </ButtonText>
      </View>
    </TouchableItem>
  </View>
);

export default ContainedButton;
