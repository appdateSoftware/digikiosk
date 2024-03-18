/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useState, useEffect } from "react";
import {
  FlatList,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from "react-native";

// import components
import OrderItem from "../components/OrderItemB";
//import mobx
import { inject, observer } from "mobx-react";
// import colors
import Colors from "../../theme/colors";

// OrdersA Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  container: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  productsContainer: {
    paddingTop: 8
  }
});

// OrdersA
const  OrdersA = ({navigation, feathersStore}) => {

  const [orders, setOrders] = useState(null);
  
  useEffect (() => {
    initOrders();
  }, []);

  const initOrders = async() => {
    let orders = await feathersStore.ordersPerUser();         
    setOrders(orders);
  }
  
  const navigateToProduct = (item) => {    
    feathersStore.getProduct(item.product_id).then(prod => {     
      prod && navigation.navigate("Product", {product: JSON.stringify(prod)});
    })
  };

  const goBack = () => {    
    navigation.goBack();
  };

  const navigateTo = screen => () => {   
    navigation.navigate(screen);
  };

  const keyExtractor = item => item._id;

  const renderItem = ({ item, index }) => (
    <OrderItem
      key={index}
      activeOpacity={0.8}
      orderNumber={item._id.slice(-6)}
      orderDate={new Date(item.createdAt).toLocaleDateString()}
      orderItems={item.items}
      orderStatus={item.status}
      transportation={item?.transportations || 0}
      discounts={item?.discounts || 0}
      adhocDiscountText={item?.adhocDiscountText}
      onPress={navigateToProduct}
      orderTotal={item.total}
    />
  );

  return (
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <View style={styles.container}>
          <FlatList
            data={orders}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.productsContainer}
          />
        </View>
      </SafeAreaView>
    );  
}

export default inject('feathersStore')(observer(OrdersA))
