import * as React from 'react';
;
import {useTheme} from '@react-navigation/native';
import {View} from 'react-native';

function Card(props) {
  const {colors} = useTheme();
  const {Component, style, secondary, third, ...rest} = props;
  const bgColor = third
    ? colors.thirdCard
    : secondary
    ? colors.secondaryCard
    : colors.card;

  return <Component {...rest} style={[{backgroundColor: bgColor}, style]} />;
}
/*
Card.propTypes = {
  Component: PropTypes.elementType,
  secondary: PropTypes.bool,
  third: PropTypes.bool,
};
*/
Card.defaultProps = {
  Component: View,
  secondary: true,
  third: false,
};

export default Card;
