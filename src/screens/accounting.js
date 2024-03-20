import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator, 
  Image,
} from 'react-native';
import Text from '../components/Text';
import Card from '../components/Card';
import ItemDelivery from '../containers/ItemDelivery';
//import Loading from '../containers/Loading';

import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import Colors from "../theme/colors";

import { inject, observer } from "mobx-react";

import useTranslate from '../hooks/useTranslate';

const AccountingScreen = ({navigation, route, feathersStore}) => { 

  let common = useTranslate(feathersStore.language);

 

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator animating size="small" />;
  };


    
  
   

    return ( 
      <>
      { ((!loading && deliveries.length < 1) || !status) ?
     
        <View style={styles.viewEmpty}>
    

          <Card style={styles.cardEmpty}>
            {require('../assets/images/empty.png') && <Image source={require('../assets/images/empty.png')} />}
            <Text third medium h3 h3Style={styles.textEmpty}>
              {common.textEmpty}
            </Text>
          </Card>
        </View>
      :    
      <FlatList
        data={deliveries?.filter(d => d.deliveryStatus === status)}
        keyExtractor={item => item._id}
        renderItem={({item, index}) => (
          <ItemDelivery
            item={item}
            style={[
              styles.itemDelivery,
              index === deliveries.length - 1 && styles.itemDeliveryEnd,
            ]}         
          />
        )}
        ListHeaderComponent={headerComponent}
     //   onEndReached={this.handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
    //    refreshing={refreshing}
    //    onRefresh={this.handleRefresh}
        showsVerticalScrollIndicator={false}
      />
    }
    </>
    );
          
}

const styles = StyleSheet.create({
  header: {
    paddingTop: getStatusBarHeight(),
    paddingHorizontal: 20,
  },
  loading: {
    marginTop: 12,
    marginBottom: 20,
  },
  user: {
    marginTop: 20,
    marginBottom: 30,
  },
  shipping: {
    marginBottom: 30,
  },
  itemDelivery: {
    marginTop: 12,
    marginHorizontal: 20,
  },
  itemDeliveryEnd: {
    marginBottom: 20,
  },
  testStatus: {
    marginBottom: 8,
  },
  viewEmpty: {
    flex: 1,
  },
  cardEmpty: {
    flex: 1,
    marginBottom: 30,
    marginHorizontal: 20,
    paddingHorizontal: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadowDefault,
  },
  textEmpty: {
    textAlign: 'center',
    marginTop: 30,
  },
  newVersion: {
    backgroundColor: Colors.tertiaryColor ,    //'#ccd'
    fontSize: 14,
    color: Colors.onSecondaryColor,  //'#333'
    textAlign: 'center',
    paddingVertical: 2, 
    marginBottom: 8,   
  },
});

export default inject('feathersStore')(observer(AccountingScreen));
