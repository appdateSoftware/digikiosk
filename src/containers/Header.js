import * as React from 'react';
import {StyleSheet,  } from 'react-native';
import {Header} from 'react-native-elements';

function HeaderComponent(props) {
  const {containerStyle, ...rest} = props;
  return (
    <Header
      {...rest}
      containerStyle={StyleSheet.flatten([styles.container, containerStyle])}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    borderBottomWidth: 0,
  },
});
/*
HeaderComponent.propTypes = {
  containerStyle:  .style,
};
*/
HeaderComponent.defaultProps = {
  containerStyle: {},
};

export default HeaderComponent;
