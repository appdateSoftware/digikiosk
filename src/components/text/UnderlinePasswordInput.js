/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {forwardRef} from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


// import colors
import Colors from '../../theme/colors';

// UnderlinePasswordInput Config
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

// UnderlinePasswordInput Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    width: INPUT_WIDTH
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 0,
    height: INPUT_HEIGHT,
    fontSize: 16,
    color: Colors.primaryText
  },
  toggleContainer: {
    paddingLeft: 10
  },
  toggleText: {
    padding: 3,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primaryText
  },
  iconContainer: {
    marginRight: 10
  }
});

// UnderlinePasswordInput
const UnderlinePasswordInput = forwardRef(({
  onChangeText,
  onFocus,
  inputFocused,
  onSubmitEditing,
  returnKeyType,
  placeholder,
  placeholderTextColor,
  inputTextColor,
  secureTextEntry = true,
  borderColor,
  focusedBorderColor,
  toggleVisible,
  toggleText,
  inputStyle,
  onTogglePress,
  inputContainerStyle,
  iconName
}, ref) => (
  <View
    style={[
      styles.container,
      borderColor && { borderColor },
      inputFocused && { borderColor: focusedBorderColor },
      inputContainerStyle && inputContainerStyle
    ]}
  >
     <View style={styles.iconContainer}>
      <Feather name={iconName} size={32} color={inputTextColor} />
    </View>
    <TextInput
      ref={ref}
      onChangeText={onChangeText}
      onFocus={onFocus}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      secureTextEntry={secureTextEntry}
      autoCapitalize="none"
      style={[styles.textInput, inputTextColor && { color: inputTextColor }]}
    />
    <View style={styles.toggleContainer}>
      {toggleVisible && (
        <TouchableOpacity activeOpacity={0.9} onPress={onTogglePress}>
          <Text style={[styles.toggleText, inputTextColor && { color: inputTextColor }, inputStyle]}>
            {toggleText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
));

export default UnderlinePasswordInput;
