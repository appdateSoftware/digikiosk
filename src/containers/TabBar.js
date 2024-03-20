import * as React from 'react';
import {useTheme} from '@react-navigation/native';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '../components/Text';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Icon from '../components/Icon';
import {shadowTabBar} from '../utils/shadow';
import { inject, observer } from "mobx-react";
import useTranslate from '../hooks/useTranslate';

const TabBar = ({state, navigation, feathersStore}) => {
  let common = useTranslate(feathersStore.language);
  const {colors} = useTheme();
  const visit = state.index;

  const insets = useSafeAreaInsets();

  const data = [
    {
      icon: 'home',
      name: common.text_home,
      router: 'HomeScreen',
    },
    {
      icon: 'truck-fast',
      name: common.text_deliveries,
      router: 'DeliveryScreen',
    },
    {
      icon: 'bell',
      name: common.text_notification,
      router: 'NotificationScreen',
    },
    {
      icon: 'account-circle',
      name: common.text_account,
      router: 'AccountScreen',
    },
  ];

  return (
    <Card
      secondary={false}
      style={[styles.container, {paddingBottom: insets.bottom}]}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={item.icon}
          style={styles.item}
          onPress={() => navigation.navigate(item.router)}>
          <View style={styles.icon}>
            <Icon
              name={item.icon}
              size={24}
              color={visit === index ? colors.primary : colors.thirdText}
            />
            {item.count ? (
              <Badge
                value={item.count}
                status="error"
                containerStyle={styles.badge}
                textStyle={styles.textBadge}
              />
            ) : null}
          </View>
          <Text
            third={visit !== index}
            medium
            h6
            h6Style={visit === index && {color: colors.primary}}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    ...shadowTabBar,
  },
  item: {
    flex: 1,
    paddingHorizontal: 7,
    paddingVertical: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    left: 14,
    borderWidth: 0,
    height: 16,
    minWidth: 16,
    borderRadius: 8,
  },
  textBadge: {
    fontSize: 10,
    lineHeight: 16,
  },
});

export default inject('feathersStore')(observer(TabBar));
