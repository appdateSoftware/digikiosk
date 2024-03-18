import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  BackHandler,
  Alert,
  Image,
  Linking
} from 'react-native';
import Text from '../components/Text';
import Card from '../components/Card';
import ItemDelivery from '../containers/ItemDelivery';
import Loading from '../containers/Loading';
import LoadingItemDelivery from '../containers/LoadingItemDelivery';
import InfoUser from './home/InfoUser';
import SelectStatusDelivery from './home/SelectStatusDelivery';
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import axios from 'axios';
import Colors from "../theme/colors";

import { inject, observer } from "mobx-react";

import useTranslate from '../hooks/useTranslate';

const SettingsScreen = ({navigation, route, feathersStore}) => { 

  let common = useTranslate(feathersStore.language);

  const [deliveries, setDeliveries] = useState([]);
  const [countStatus, setCountStatus] = useState({
    pending: 0,
    delivered: 0,
  });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Pending'); 

  useEffect(() => {  
    fetchDeliveries('');  
  }, [feathersStore?.isAuthenticated,
     feathersStore.loadingNotification, feathersStore.ordersChangedEvent]); 

  useEffect( () => { //Check for updates  
    checkForUpdates();
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {     

        // Prevent default behavior of leaving the screen
        e.preventDefault();       
        Alert.alert(
          `${common.exitAppTitle}`,
          `${common.exitAppText}`,
          [
            { text: `${common.noText}`, style: 'cancel', onPress: () => {} },
            {
              text: `${common.yesText}`,
              style: 'destructive',              
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
      }),
    [navigation, common]
  );

  const checkForUpdates = async() => {
    const versionPath = 'https://sites.appdate.gr/versions.json';
     const res = await axios.get(versionPath);
     const newVersion = res.data?.deliveryBoy;
     if(newVersion === feathersStore.currentVersion)        
     feathersStore.setNewVersion(false);
     else feathersStore.setNewVersion(true);
 }

 const goToPlayStore = () => {
    Linking.openURL("https://play.google.com/store/apps/details?id=com.bringfood_db_android")
  }
  
  const fetchStatus = (data) => {         
    const pending = data.filter(del => del.deliveryStatus === "Pending")?.length ?? 0;
    const loaded = data.filter(del => del.deliveryStatus === "Loaded")?.length ?? 0;
    const delivered = data.filter(del => del.deliveryStatus === "Delivered")?.length ?? 0;
    setCountStatus({pending, loaded, delivered})    
  };
  

  const fetchDeliveries = async (value) => {
    try {         
      const data = await feathersStore.ordersPerUser(value);
      if(data.length > 0){
        setLoading(false);
        setDeliveries(data);  
        fetchStatus(data);
      }     
    } catch (e) {
      console.log(e);
      setLoading(false);    
    }
  };

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator animating size="small" />;
  };

  const updateStatus = async(value) => {    
    setStatus(value);
  };

    
    const listStatus = [  
      {
        type: 'pending',
        name: "Pending",
        count: countStatus?.pending ?? 0,
      },  
      {
        type: 'loaded',
        name: "Loaded",
        count: countStatus?.loaded ?? 0,
      },
      {
        type: 'delivered',
        name: "Delivered",
        count: countStatus?.delivered ?? 0,
      },    
    ];   
     const headerComponent = () => (
      <View style={styles.header}>
        {feathersStore?.newVersion &&  
          <Text onPress={goToPlayStore} style={styles.newVersion}>
            {common?.newVersion}
          </Text>
        } 
        {feathersStore?.user && <InfoUser style={styles.user} user={feathersStore?.user} />}
        <SelectStatusDelivery
          style={styles.shipping}
          selectStatus={updateStatus}
          list={listStatus}
        />
        {(loading || (!loading && deliveries.length > 0)) &&
        status ? (
          <Text h3 medium h3Style={styles.testStatus}>
            {status}
          </Text>
        ) : null}
        {loading && (
          <Loading
            ItemComponent={LoadingItemDelivery}
            containerStyle={styles.loading}
          />
        )}          

      </View>
    );

   

    return ( 
      <>
      { ((!loading && deliveries.length < 1) || !status) ?
     
        <View style={styles.viewEmpty}>
          {headerComponent()}

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

export default inject('feathersStore')(observer(SettingsScreen));
