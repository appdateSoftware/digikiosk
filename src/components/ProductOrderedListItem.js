/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  StyleSheet, Text, View, Pressable, TextInput
} from 'react-native';

import { Subtitle1 } from "./text/CustomText";
import Icon from './Icon';
import Colors from '../theme/colors';
import { inject, observer } from "mobx-react";
import _useTranslate from '../hooks/_useTranslate';

const DELETE_ICON = "close";
const BUTTON_HEIGHT_SM = 22;


const ProductOrderedListItem = ({
  onPress,
  onPressDelete,  
  title,
  price = "0.00", 
  paid=false,
  toBePaid=false,
  feathersStore
}) => {

  let common = _useTranslate(feathersStore.language);

  const _onPress = () => {    
    onPress();  
  };  

  const _onPressDelete = () => {   
    onPressDelete();
  }; 
   
  return (         
    <Pressable
      style={[styles.container, paid && styles.paidBackground, toBePaid && styles.toBePaidBackground]}   
      onPress={_onPress} 
      borderless     
    >
      <View style={styles.innerContainer}>       
        <View style={styles.productInfo}>
          <View style={styles.productDetails}>
            <Text numberOfLines={2} style={styles.title}>
              {title}
            </Text>
            <Text
              style={{...styles.input, ...styles.price}}
              >{price}</Text>
             
            <Text style={styles.price}>€</Text>
          </View> 
          <View style={styles.subTitleContainer}>          
            {(!paid) ? 
              <Pressable  onPress={_onPressDelete} borderless disabled={toBePaid}>
                <View style={[styles.iconContainer, styles.deleteIcon]}>
                  <Icon name={DELETE_ICON} size={20} color={Colors.onPrimaryColor} />
                </View>
              
              </Pressable>
            : null}
          </View>                         
        </View>        
      </View>
    </Pressable>
  );  
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2, 
    marginTop: 2,
    padding:2, 
    borderWidth: 1,
    borderColor: Colors.onSurface,
    borderRadius: 4,
    backgroundColor: Colors.surface
  },
  paidBackground: {
    backgroundColor: Colors.secondaryColor
  },
  toBePaidBackground: {
    backgroundColor: Colors.tertiaryColor
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'   
  },  
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  productDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',    
  },
  title: {
    flex: 1,
    fontWeight: "500",
    fontSize: 16,
    color: Colors.primaryText,
    letterSpacing: 0.15
  }, 
  price: {
    fontWeight: "500",
    fontSize: 16,
    color: Colors.primaryText,
    letterSpacing: 0.15
  }, 
  subTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }, 
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.secondaryColor
  },
  deleteIcon: {
    backgroundColor: Colors.error
  },
  input:{
    height: BUTTON_HEIGHT_SM,
    width: 80,
    margin: 1,
    padding: 1,
    height: 28,
    borderWidth: 1,
    backgroundColor: Colors.surface,
    textAlign: "right"
  }
});
export default inject('feathersStore')(observer(ProductOrderedListItem))
