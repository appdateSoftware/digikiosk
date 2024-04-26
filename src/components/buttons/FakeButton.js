/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import FAIcon from 'react-native-vector-icons/FontAwesome';

// import components
import { ButtonText } from '../text/CustomText';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// Button Config
const BUTTON_BORDER_RADIUS = 4;
const BUTTON_HEIGHT = 48;
const BUTTON_WIDTH = '98%';
const BUTTON_HEIGHT_SM = 40;
const BUTTON_WIDTH_SM = Layout.SCREEN_WIDTH / 2;


// Button Styles
const styles = StyleSheet.create({  
  container: {  
    justifyContent: "center",
    alignItems: 'flex-start',
    marginHorizontal: "1%",
    backgroundColor: Colors.primaryColor,
    borderRadius: BUTTON_BORDER_RADIUS
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
    fontSize: 14,
    marginLeft: 2
  },
  outlinedTitle: {
    color: Colors.primaryColor
  },
  input:{
    height: BUTTON_HEIGHT_SM,
    width: "40%",
    margin: 2,
    borderWidth: 1,
    color: Colors.keyboardButton,
    padding: 2,
    backgroundColor: Colors.surface,
    fontSize: 16,
  //  fontWeight: "bold"
  }
});

// Button
const FakeButton = ({  
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
  input,
  inputMethod,
  textInput,
  editable,
  inputStyle
}) => {

   return( 
    <View  
      style={[
        styles.container,
        textInput && styles.rowContainer,
        borderRadius && { borderRadius },
        color && { backgroundColor: color },
        styles.defaultContainer,
        height && { height },
        small && styles.smallContainer,
        rounded && styles.rounded,
        outlined && styles.outlined,
        height && rounded && { borderRadius: height / 2 },
        borderColor && { borderColor },     
        buttonStyle
      ]}      
    >
      {socialIconName && (
        <View style={styles.socialIconContainer}>
          <FAIcon name={socialIconName} size={20} color={iconColor} />
        </View>
      )}
      <ButtonText
        style={[styles.title, outlined && styles.outlinedTitle, titleColor && { color: titleColor }]}
      >
        {title || 'Button'}
      </ButtonText>
      {textInput && <TextInput
        style={{...styles.input, ...inputStyle}}
        onChangeText={text => inputMethod(text)}
        value={input}
      //  placeholder="useless placeholder"
        keyboardType="numeric"
        editable={editable}
      />}
    </View>  
  );
}

export default FakeButton;
