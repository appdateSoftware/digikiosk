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
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import axios from 'axios';
import Colors from "../theme/colors";

import { inject, observer } from "mobx-react";

import useTranslate from '../hooks/useTranslate';

const HomeScreen = ({navigation, route, feathersStore}) => { 

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
  
  

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator animating size="small" />;
  };

 

    
   
     const headerComponent = () => (
      <View style={styles.header}>
        {feathersStore?.newVersion &&  
          <Text onPress={goToPlayStore} style={styles.newVersion}>
            {common?.newVersion}
          </Text>
        } 
        {feathersStore?.user && <InfoUser style={styles.user} user={feathersStore?.user} />}
              

      </View>
    );

   

    return ( 
      <>
    
     
        <View style={styles.viewEmpty}>
          {headerComponent()}

          <Card style={styles.cardEmpty}>
            {require('../assets/images/empty.png') && <Image source={require('../assets/images/empty.png')} />}
            <Text third medium h3 h3Style={styles.textEmpty}>
              {common.textEmpty}
            </Text>
          </Card>
        </View>
    
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

export default inject('feathersStore')(observer(HomeScreen));
