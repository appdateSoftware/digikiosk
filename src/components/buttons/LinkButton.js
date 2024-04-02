/**
 * Digi-Kiosk
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';


import { ButtonText } from '../text/CustomText';

import Colors from '../../theme/colors';


const ripple = {
  borderless: true,
}

const LinkButton = ({ 
  onPress, 
  title, 
  titleStyle, 
  iconName, 
  iconColor, 
  iconNameRight, 
  iconColorRight,
  disabled
}) => ( 
  <Pressable disabled={disabled} android_ripple={ripple} onPress={onPress}> 
    <View style={styles.container}>
      { iconName &&
        <View style={styles.iconContainer}>
          <Feather name={iconName} size={16} color={iconColor} />
        </View>
      }   
      <ButtonText  style={[styles.title, titleStyle]}>
        {title || 'Link Button'}
      </ButtonText>
      { iconNameRight &&
        <View style={styles.iconContainerRight}>
          <Feather name={iconNameRight} size={16} color={iconColorRight} />
        </View>
      }
      </View>     
  </Pressable>  
 
);

const styles = StyleSheet.create({
  title: {
    padding: 2,
    color: Colors.primaryColor
  },
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8
  },
  iconContainer: {
    marginRight: 10
  },
  iconContainerRight: {
    marginLeft: 10
  }
});


export default LinkButton;
