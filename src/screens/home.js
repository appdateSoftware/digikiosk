import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  Image,
  Linking
} from 'react-native';
import Text from '../components/Text';
import NumericKeyboard from '../components/NumericKeyboard';

import Card from '../components/buttons/Card';
import TouchableItem from "../components/TouchableItem";
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import axios from 'axios';
import Colors from "../theme/colors";
import {useRealm, useQuery } from '@realm/react';

import { inject, observer } from "mobx-react";

import useTranslate from '../hooks/useTranslate';

const colorsArray = [{
  "id" : "blue",
  "value" : Colors.primaryColor
}, {
  "id" : "turquize",
  "value" : Colors.accentColor
}, {
  "id" : "red",
  "value" : Colors.tertiaryColor
}, {
  "id" : "light yellow",
  "value" : Colors.overlayColor
}, {
  "id" : "orange",
  "value" : Colors.selection
}, {
  "id" : "black",
  "value" : Colors.black
}, {
  "id" : "dark blue",
  "value" : Colors.primaryColorDark
}]

const HomeScreen = ({navigation, route, feathersStore}) => { 

  const realm = useRealm();
  const realm_sections = useQuery('Section');

  let common = useTranslate(feathersStore.language);

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(1); 

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
     const newVersion = res.data?.digiKiosk;
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

  const sectionBtnPressed = (item) => {
    setSection(item);
  }

  const renderSectionItem = (item, index) => (
    <View
      key={index}
      style={[styles.card, {backgroundColor: findColor(item.color)}]}
    >
      <TouchableItem
        onPress={sectionBtnPressed(item)}
        style={styles.cardContainer}
        // borderless
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        
      </TouchableItem>        
    </View>
  );

  const findColor = (id) => {
    return colorsArray.find(color => color.id === id)?.value || ""
  }
   
  const headerComponent = () => (
    <View style={styles.header}>
      {feathersStore?.newVersion &&  
        <Text onPress={goToPlayStore} style={styles.newVersion}>
          {common?.newVersion}
        </Text>
      }   

    </View>
  );

  return ( 
    <> 

      <View style={styles.viewEmpty}>
        {headerComponent()}

        <Card style={styles.cardEmpty}>
          {require('../assets/img/empty.png') && <Image source={require('../assets/img/empty.png')} />}
          <Text third medium h3 h3Style={styles.textEmpty}>
            {common.textEmpty}
          </Text>
        </Card>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          alwaysBounceHorizontal={false}
          contentContainerStyle={styles.sectionsList}
        >
          {realm_sections?.map(( item, index ) => renderSectionItem(item, index))}
        </ScrollView>  
        <NumericKeyboard/>
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
  sectionsList: {
    paddingTop: 4,
    paddingRight: 16,
    paddingLeft: 8
  },
  cardImg: { borderRadius: 4 },
  card: {
    marginLeft: 8,
    width: 104,
    height: 72,
    borderRadius: 4
  },
  cardContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  cardTitle: {
    padding: 12,
    fontWeight: "500",
    fontSize: 16,
    color: Colors.white,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
});

export default inject('feathersStore')(observer(HomeScreen));
