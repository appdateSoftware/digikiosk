import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, Animated} from 'react-native';
import Text from '../components/Text';
import {fonts, lineHeights, sizes} from '../configs/fonts';
const MIN_HEIGHT = 46;
const TOP = 8;
const BOTTOM = 6;

class ViewLabel extends React.Component {
  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.isHeading ? 1 : 0);
  }
  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.props.isHeading ? 1 : 0,
      duration: 120,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const {label, error, children, theme, secondary} = this.props;
    const {colors} = theme;
    const paddingHorizontal = 7;
    const topCenter = (MIN_HEIGHT - lineHeights.h5) / 2;
    const labelStyle = {
      position: 'absolute',
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [topCenter, -TOP],
      }),
      fontFamily: fonts.regular,
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [sizes.base, 10],
      }),
      lineHeight: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [lineHeights.h5, 15],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [colors.secondaryText, colors.text],
      }),
      zIndex: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 9999],
      }),
      backgroundColor: secondary
        ? colors.secondaryBackground
        : colors.background,
      paddingHorizontal: paddingHorizontal,
      marginHorizontal: 9,
    };
    return (
      <View style={styles.contentContainer}>
        <View
          style={[
            styles.container,
            {
              borderColor: colors.border,
            },
          ]}>
          {typeof label === 'string' ? (
            <Animated.Text style={labelStyle} numberOfLines={1}>
              {label}
            </Animated.Text>
          ) : null}
          {children}
        </View>
        {typeof error === 'string' ? (
          <Text
            h5={false}
            style={[
              styles.textError,
              {
                color: colors.error,
              },
            ]}>
            {error}
          </Text>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: BOTTOM,
  },
  container: {
    minHeight: MIN_HEIGHT,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: TOP,
    marginBottom: 5,
  },
  textError: {
    fontSize: 10,
    lineHeight: 15,
    marginBottom: 5,
  },
});

ViewLabel.defaultProps = {
  isHeading: false,
  visit: 'center',
  secondary: false,
};

export default function ViewLabelComponent(props) {
  const theme = useTheme();
  return <ViewLabel {...props} theme={theme} />;
}

export {MIN_HEIGHT};
