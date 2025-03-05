import * as React from 'react';
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';

const Card = ({Component = View, style, secondary = true, third = false, ...rest}) => {
  const {colors} = useTheme();
  const bgColor = third
    ? colors.thirdCard
    : secondary
    ? colors.secondaryCard
    : colors.card;

  return <Component {...rest} style={[{backgroundColor: bgColor}, style]} />;
}

export default Card;
