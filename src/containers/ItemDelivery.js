import * as React from 'react';
;
import {useNavigation, useTheme} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View,  } from 'react-native';
import Text from '../components/Text';
import Icon from '../components/Icon';
import Opacity from '../components/Opacity';
import Card from '../components/Card';
import currencyFormatter from '../utils/currency-formatter';
import {shadowDefault} from '../utils/shadow';
import { inject, observer } from "mobx-react";
import useTranslate from '../hooks/useTranslate';

const chevronRightIcon = "chevron-right";

const ItemDelivery = ({item, style, feathersStore}) => {

  let common = useTranslate(feathersStore.language);
  const navigation = useNavigation();  
  const {colors} = useTheme();
  if (!item) {
    return null;
  }
  const colorDot =
    item?.status === 'Delivered' ? colors.success : colors.error;
  return (
    <Card
      Component={TouchableOpacity}
      style={StyleSheet.flatten([styles.container, style])}
      onPress={() =>
        navigation.navigate('DeliveryDetailScreen', {
          data: item,      
        })
      }>
      <Opacity bgColor={colorDot} opacity={0.1} style={styles.viewIconLeft}>
        <View
          style={StyleSheet.flatten([styles.dot, {backgroundColor: colorDot}])}
        />
      </Opacity>
      <View style={styles.right}>
        <View style={styles.headerRight}>
          <Text medium h4 h4Style={{color: colors.secondary}}>
            #{item._id.slice(-6)}
          </Text>
          {
          item.unpaid >= 0 ? (
            <Text h6 h6Style={{color: colors.error}}>
              {common.remainPayment}
              {'   '}
              <Text medium h4 h4Style={{color: colors.primary}}>
                {currencyFormatter(item.unpaid, 'EUR')}
              </Text>
            </Text>
         ) : null
        }
        </View>
        <View style={styles.viewName}>
          <Text h4 medium style={styles.name}>
            {item?.lastName ?? ''}
          </Text>
          <Icon
            name={chevronRightIcon}
            color={colors.secondaryIcon}
            size={20}
            isRotateRTL
          />
        </View>
        <Text third h6>
          {item.paymentMethod}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 22,
    borderRadius: 8,
    flexDirection: 'row',
    ...shadowDefault,
  },
  viewIconLeft: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  right: {
    flex: 1,
    marginLeft: 17,
    marginTop: 4,
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewName: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    flex: 1,
  },
});
/*
ItemDelivery.typeProps = {
  item: PropTypes.object.isRequired,
  style:  .style,
};
*/
ItemDelivery.defaultProps = {
  style: {},
};
export default inject('feathersStore')(observer(ItemDelivery));
