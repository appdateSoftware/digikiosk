/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';


// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// Button Config
const BUTTON_BORDER_RADIUS = 4;
const BUTTON_HEIGHT = 68;
const BUTTON_WIDTH = '92%';
const BUTTON_HEIGHT_SM = 40;
const BUTTON_WIDTH_SM = Layout.SCREEN_WIDTH / 2;

// Button Styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginHorizontal: "4%",
    backgroundColor: Colors.primaryColor,
    borderRadius: BUTTON_BORDER_RADIUS
  },
  defaultContainer: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT
  },
  smallContainer: {
    maxWidth: BUTTON_WIDTH_SM,
    height: BUTTON_HEIGHT_SM,
    paddingHorizontal: 16
  },
  disabled: {
    opacity: 0.72
  },
  socialIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 52
  },
  outlined: {
    borderWidth: 2,
    borderColor: Colors.primaryColor,
    backgroundColor: 'transparent'
  },
  rounded: {
    borderRadius: BUTTON_HEIGHT / 2
  },
  title: {
    color: Colors.onPrimaryColor,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12
  },
  outlinedTitle: {
    color: Colors.primaryColor
  },
  textRight: {
    flexDirection: "row",  
    width: BUTTON_WIDTH,
    justifyContent: "flex-end",   
  },
  biggerFont: {
    fontSize: 18,
    marginRight: 12
  }
});

const ButtonTablet = ({
  onPress,
  disabled,
  activeOpacity = 0.85,
  height,
  buttonStyle,
  borderRadius,
  borderColor,
  color,
  iconColor,
  socialIconName,
  small,
  title,
  titleColor,
  rounded,
  outlined,
  showActivityIndicator,
  textRight,
  biggerFont
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
    style={[
      styles.container,
      borderRadius && { borderRadius },
      color && { backgroundColor: color },
      styles.defaultContainer,
      height && { height },
      small && styles.smallContainer,
      rounded && styles.rounded,
      outlined && styles.outlined,
      height && rounded && { borderRadius: height / 2 },
      borderColor && { borderColor },
      disabled && styles.disabled,
      buttonStyle, 
      textRight && styles.textRight
    ]}
  >
    {socialIconName && (
      <View style={styles.socialIconContainer}>
        <FAIcon name={socialIconName} size={20} color={iconColor} />
      </View>
    )}
    <Text
      style={[styles.title, outlined && styles.outlinedTitle, titleColor && { color: titleColor }, biggerFont && styles.biggerFont]}
    >
      {title || 'Button'}
    </Text>
    {showActivityIndicator && <ActivityIndicator size="small" color="#fff" />}
  </TouchableOpacity>
);

export default ButtonTablet;
