/**
 * Digi Kiosk - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Divider Styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 1,
    backgroundColor: '#eeeeee'
  },
  mh16: {
    marginHorizontal: 16
  }
});



// Divider
const Divider = ({ marginLeft, type }) => (
  <View
    style={[styles.container, type === 'inset' && { marginLeft }, type === 'middle' && styles.mh16]}
  />
);

export default Divider;
