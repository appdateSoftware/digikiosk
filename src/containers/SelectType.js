import React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity,  } from 'react-native';
import Text from '../components/Text';
import Icon from '../components/Icon';
import {shadowBottom} from '../utils/shadow';

const  SelectType = ({lists, valueSelect, onSelect, containerStyle}) => {
  const {colors} = useTheme();

  return lists.map((list, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.85}
      style={[
        styles.container,
        index !== lists.length - 1 && shadowBottom,
        containerStyle,
      ]}
      onPress={() => onSelect(list)}>
      <Text
        h4
        medium
        h4Style={[
          styles.text,
          list.status === valueSelect && {color: colors.primary},
        ]}>
        {list.name}
      </Text>
      {list.status === valueSelect ? (
        <Icon name="check" color={colors.primary} />
      ) : null}
    </TouchableOpacity>
  ));
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    flex: 1,
  },
});

export default SelectType;
