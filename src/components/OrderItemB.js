/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// import components
import Button from '../buttons/Button';
import { Caption, Subtitle1, Subtitle2 } from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors. layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

import { inject, observer } from "mobx-react";
import _useTranslate from '../../hooks/_useTranslate';


const OrderItemB = ({
  onPress,
  activeOpacity,
  orderNumber,
  orderDate,
  orderItems,
  orderStatus,
  orderTotal,
  feathersStore,
  transportation,
  discounts,
  adhocDiscountText
}) => {

  const parse_fix = price => {
    return price ? parseFloat(price).toFixed(2) : 0;
  } 

  let common = _useTranslate(feathersStore.language);

  return(
  <View style={styles.container}>
    <View style={styles.content}>
      <View style={styles.header}>
        <View>
          <Subtitle2 style={styles.orderNumber}>{`${common.order} #${orderNumber}`}</Subtitle2>
          <Caption>{orderDate}</Caption>
        </View>
        <View style={styles.flexEnd}>
          <Subtitle1>{`${common.total}: ${parse_fix(orderTotal)}€`}</Subtitle1>
          <Caption>{`${orderItems.length} ΤΜΧ`}</Caption>
        </View>
      </View>

      <View style={styles.divider}>
        <View style={[styles.circleMask, styles.leftCircle]} />
        <View style={styles.dividerLine} />
        <View style={[styles.circleMask, styles.rightCircle]} />
      </View>

      <View style={styles.pv8}>
        {orderItems.map((item, index) => (
          <View key={index.toString()} style={styles.itemContainer}>
            <TouchableItem disabled={!item.enabledForDelivery} onPress={onPress.bind(this, item)} activeOpacity={activeOpacity}>
              <View style={styles.item}>
                <Subtitle2 style={!item.enabledForDelivery && { color : 'red' }}>{feathersStore._translate(item.product_name, item.product_nameTranslated)} x {item.product_quantity}</Subtitle2>
                <Subtitle2 style={!item.enabledForDelivery && { color : 'red' }}>{` ${parse_fix(item.product_totalPrice)}€`}</Subtitle2>
              </View>
            </TouchableItem>
          </View>
        ))}
        {transportation > 0 &&               
          <View style={styles.item}>
            <Subtitle2 >{common.transportation}</Subtitle2>
            <Subtitle2>{`${parse_fix(transportation)}€`}</Subtitle2>
          </View>
        }
        {discounts  > 0 &&   
          <View style={styles.item}>
            <Subtitle2 >{common.discount} {adhocDiscountText}%</Subtitle2>
            <Subtitle2>{`${parse_fix(discounts)}€`}</Subtitle2>
          </View>
        }
      </View>

      {orderStatus === 'on-the-way' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2>Status</Subtitle2>
            <Subtitle2 style={styles.onTheWay}>On the way</Subtitle2>
          </View>
          <Button title="Track" buttonStyle={styles.extraSmallButton} />
        </View>
      )}

      {orderStatus === 'pending' && (
        <View style={styles.footer}>
          <View>
            <Subtitle2>Status</Subtitle2>
            <Subtitle2 style={styles.pending}>Pending delivery</Subtitle2>
          </View>
          <Button
            title="Cancel"
            color={Colors.secondaryColor}
            buttonStyle={styles.extraSmallButton}
          />
        </View>
      )}

      {/* {orderStatus === 'delivered' && ( */}
        {(
        <View style={styles.footer}>
          <View>
            <Subtitle2 style={styles.delivered}>{common.order1}</Subtitle2>
            <Text style={{fontSize: 12}}>{common.order2}</Text>
            <Text style={{fontSize: 12}}>{common.order3}</Text>
            <Text style={{fontSize: 12}}>{common.order4}</Text>
          </View>
          {/* <Button title="Reorder" buttonStyle={styles.extraSmallButton} onPress={logout}/> */}
        </View>
      )}
    </View>
  </View>
);
}

// OrderItemB Styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 16,
    backgroundColor: Colors.background
  },
  content: {
    width: Layout.SCREEN_WIDTH - 2 * 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16
  },
  orderNumber: {
    paddingBottom: 2,
    color: Colors.primaryColorDark
  },
  flexEnd: {
    alignItems: 'flex-end'
  },
  divider: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#efefef'
  },
  circleMask: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#efefef'
  },
  leftCircle: {
    left: -9
  },
  rightCircle: {
    right: -9
  },
  pv8: {
    paddingVertical: 8
  },
  itemContainer: {
    marginVertical: 4,
    backgroundColor: Colors.background
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 36
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16
  },
  extraSmallButton: {
    width: 116,
    height: 32,
    borderRadius: 16
  },
  onTheWay: {
    color: Colors.tertiaryColor
  },
  pending: {
    color: Colors.secondaryColor
  },
  delivered: {
    color: Colors.primaryColor
  }
});


export default inject('feathersStore')(observer(OrderItemB));
