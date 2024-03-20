import React from 'react';
import {StyleSheet} from 'react-native';
import Card from '../components/Card';
import {shadowDefault} from '../utils/shadow';

const LoadingItemDelivery = ({style, ...rest}) => {
  
  return <Card {...rest} style={[styles.card, style]} />;
}
const styles = StyleSheet.create({
  card: {
    height: 125,
    borderRadius: 8,
    ...shadowDefault,
  },
});

export default LoadingItemDelivery;
