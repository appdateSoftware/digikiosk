/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {forwardRef} from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
//import { TextInput } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';
import HeaderIconButton from "../../components/HeaderIconButton";

// import colors, layout
import Colors from '../../theme/colors';

// UnderlineTextInput Config
const INPUT_HEIGHT = 44;
const INPUT_WIDTH = '100%';

// UnderlineTextInput Styles
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
  iconContainer: {
    marginRight: 10
  }
});


// UnderlineTextInput
const UnderlineTextInput = forwardRef(({  
  onChangeText,
  onFocus,
  inputFocused,
  onSubmitEditing,
  returnKeyType,
  blurOnSubmit,
  keyboardType,
  placeholder,
  placeholderTextColor,
  value,
  inputTextColor,
  secureTextEntry,
  borderColor,
  focusedBorderColor,
  inputContainerStyle,
  inputStyle,
  iconName,
  editable,
  rightIcon,
  showRightIcon,
  rightIconPress,
  selection  
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
      inputFocused={inputFocused}
      editable={editable}
      onSubmitEditing={onSubmitEditing}
      returnKeyType={returnKeyType}
      blurOnSubmit={blurOnSubmit}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      value={value}
      secureTextEntry={secureTextEntry}
      style={[styles.textInput, inputTextColor && { color: inputTextColor }, inputStyle]}  
      selection={selection}
    />
    { showRightIcon && 
        <HeaderIconButton
          onPress={rightIconPress}
          name={rightIcon}
          color={Colors.primaryColor}
        />
    }
     
  </View>
));

export default UnderlineTextInput;
