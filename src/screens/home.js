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
import ProductOrderedListItem from "../components/ProductOrderedListItem";
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import axios from 'axios';
import Colors from "../theme/colors";
import Color from "color";
import {useRealm, useQuery } from '@realm/react';
import Button from "../components/buttons/Button";
import FakeButton from "../components/buttons/FakeButton";
import ButtonWithField from "../components/buttons/ButtonWithField";
import Icon from "../components/Icon";
import cloneDeep from 'lodash/cloneDeep';
import CancelItemModal from "../components/modals/CancelItemModal";

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

const checkIcon = "checkmark";

const HomeScreen = ({navigation, route, feathersStore}) => { 

  const realm = useRealm();
  const realm_products = useQuery('Product');
  const realm_sections = useQuery('Section');

  let common = useTranslate(feathersStore.language);

  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState(1); 
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState("0");
  const [unpaid, setUnpaid] = useState(0);
  const [cash, setCash] = useState("0");
  const [cashToPay, setCashToPay] = useState("0");
  const [change, setChange] = useState("0");
  const [issuingReceipt, setIssuingReceipt] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [indexToCancel, setIndexToCancel] = useState(null);
  const [enterPrice, setEnterPrice] = useState(true);


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

  const setCharacterInput = (ch) => () => {      
   
    if(enterPrice)setPrice(oldVal => {
      let priceString = oldVal + ch;
      if(+priceString >= 1){
        if(priceString[0] === "0")priceString = priceString.slice(1);       
      }
      return priceString;
    });else setCash(oldVal => {
      let priceString = oldVal + ch;
      if(+priceString >= 1){
        if(priceString[0] === "0")priceString = priceString.slice(1);       
      }
      return priceString;
    });       
  }

  const setBackspace = () => () => {
    if(enterPrice){    
        if(price.length === 1)setPrice("0");
        else setPrice(oldVal => oldVal.slice(0, -1));
      }
    }
  
    const receivedPressed = () => () => {
      console.log("VOOO")
      setEnterPrice(false)
    }


  const sectionBtnPressed = (item) => () => {
    setPrice("0")
    const product = {
    //  section: item,
      name: item.name,
      product_totalPrice: parseFloat(price),
      color: item.color,
      vatAmount: 0,
      underlyingValue: 0
    }
    
    setOrderItems(prevVal => {
      let orderItemsClone = cloneDeep(prevVal);
      orderItemsClone.push(product);
      return orderItemsClone;
    });
    
  }

  const renderSectionItem = (item, index) => (
    <View
      key={index}
      style={[styles.card, {backgroundColor: findColor(item.color)}]}
    >
      <TouchableItem
        onPress={sectionBtnPressed(item)}
        style={styles.cardContainer}
        disabled={+price === 0}
        // borderless
      >
        <Text style={styles.cardTitle}>{item.name}</Text>
        
      </TouchableItem>        
    </View>
  );

  const findColor = (id) => {
    return colorsArray.find(color => color.id === id)?.value || ""
  }

  const onChangeCash = text => {
    setCash(text);
    calculateChange(text);
  }

  const calculateChange = (cashText) => {
    setChange(parse_fix(cashText - cashToPay).toString())   
  }

  const selectAll = async() => {

    setCashToPay(0);
   
      for(const [index, value] of orderItems.entries()){
        if(!value?.paid){  
          Object.assign(value, {toBePaid: true})
          setOrderItems(prevVal => {
            let orderItemsClone = cloneDeep(prevVal);
            orderItemsClone.splice(+index, 1, value);
            return orderItemsClone;
          });      
          setCashToPay(prevVal => parse_fix(+prevVal + +value.product_totalPrice).toString());
        }      
      }   
    
    calculateChange(cash);
  }

  const togglePayment = (_item, indexToPay) => async() => {
    let item = _item;
    if(item.paid === true) return;

    if(item?.toBePaid){
      Object.assign(item, {toBePaid: false});
      setCashToPay(prevVal => parse_fix(prevVal - item.product_totalPrice).toString());
    }
    else{
      Object.assign(item, {toBePaid: true});
      setCashToPay(prevVal => parse_fix(+prevVal + +item.product_totalPrice).toString());
    }  
    setOrderItems(prevVal => {
      let orderItemsClone = cloneDeep(prevVal);
      orderItemsClone.splice(+indexToPay, 1, item);
      return orderItemsClone;
    });
    calculateChange(cash);
  }

  const payItems = async(method) => { 
    let paidSum = 0;
    orderItems.filter(o => o.toBePaid).forEach(listItem =>  {
      Object.assign(listItem, {toBePaid: false, paid: true});     
      paidSum += +listItem.product_totalPrice;
    });
    setUnpaid(parseFloat((unpaid - paidSum).toFixed(2)));
  }  

  const payVisa = async() => {
    await payItems('Visa');
  }

  const payCash = async() => {
    await payItems('Cash');   
  }

  const deleteItem = index => () => {  
    setCancelModalVisible(true); 
    setIndexToCancel(index);   
  }

  const cancelItem = () => {
    setOrderItems(prevVal => {
      let orderItemsClone = cloneDeep(prevVal);
      orderItemsClone.splice(+indexToCancel, 1);
      return orderItemsClone;
    });
    setCancelModalVisible(false);
  }

  const resetCashInputs = () => {
    setCashToPay("0");
    setChange("0");
    setCash("0");
    setTypedDiscount("0");
    typedDiscountRef.current = 0;
  } 

  const renderProductListItem = useCallback(
    (item, index) => (      
      <ProductOrderedListItem 
        key={index}         
        onPress={togglePayment(item, index)}    
        onPressDelete={deleteItem(index)}
        title={feathersStore._translate(item.name , item.nameEnglish)}     
        price={parse_fix(item.product_totalPrice)}     
        paid={item.paid}  
        toBePaid={item.toBePaid} 
      />
  ), []);

  const issueReceipt = async() => { 
  }


  const parse_fix = price => {
    return price ? parseFloat(price).toFixed(2) : 0;
  } 
   
  const headerComponent = () => (
    <View style={styles.header}>     
      <Text onPress={goToPlayStore} style={styles.newVersion}>
        {common?.newVersion}
      </Text>
    </View>
  );

  return ( 
    <> 

      <View style={styles.screenContainer}>
        {feathersStore?.newVersion && headerComponent()}
        <View style={styles.container}>
          <View style={styles.leftContainer}> 
            <ScrollView            
              contentContainerStyle={styles.productsList}
            >
              {orderItems?.map(( item, index ) => renderProductListItem(item, index))}
            </ScrollView>
          </View>
          <View style={styles.rightContainer}>
            <ScrollView            
              contentContainerStyle={styles.productsList}
            >
              <Button
                title={price}
              //  disabled={issuingReceipt || total <= 0}
              //  onPress={issueReceipt}
                titleColor={Colors.onTertiaryColor}
                color={Colors.black}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                showActivityIndicator={issuingReceipt}
                textRight={true}
                biggerFont={true}
              />
              <FakeButton
                title={`${common.total}: ${total.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
              />
              <FakeButton
                title={`${common.remainder}: ${unpaid?.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
              />          
              <FakeButton
                title={`${common.cashSmall}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={cashToPay}          
                textInput={true}
                editable={false}
              />         
              <ButtonWithField
                title={`${common.received}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={cash}
                textInput={true}
                editable={false}  
                onPress={receivedPressed}
                disabled={false}
              />           
              <FakeButton
                title={`${common.cashChange}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={change}           
                textInput={true}
                editable={false}
              />        
              <Button
                onPress={payCash}           
                title={<Icon name={checkIcon} size={32} color={Colors.onSecondaryColor}></Icon>}
                titleColor={Colors.onSecondaryColor}
                color={Colors.secondaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}
                disabled={!(cashToPay > 0)}
              /> 
              <Button
                onPress={selectAll}           
                title={`${common.payAll}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}  
              /> 
              <Button
                onPress={payVisa}           
                title={"VISA"}
                titleColor={Colors.onPrimaryColor}
                color={Colors.selectionNew}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}  
                disabled={!(cashToPay > 0)}
              /> 
            </ScrollView>
          </View>
       
        </View> 
        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            contentContainerStyle={styles.sectionsList}      
          >
            {realm_sections?.map(( item, index ) => renderSectionItem(item, index))}
          </ScrollView>    
          <NumericKeyboard 
            onPress={setCharacterInput} 
            pressBackspace={setBackspace}
          />
        </View>
      </View>
      <CancelItemModal
        visible={cancelModalVisible}
        deleteButton={cancelItem}
        cancelButton={() => setCancelModalVisible(false)}
      /> 
    </>
  );
          
}

const styles = StyleSheet.create({
  header: {
    marginTop: 5,
    marginHorizontal: 5,
    //paddingTop: getStatusBarHeight(),  
  },
   screenContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },  
  container: {
    flex: 1,
    flexDirection: "row"
  },
  leftContainer: {
    flex: 0.65,
    backgroundColor: Color(Colors.overlayColor).alpha(0.2).string(),
    borderRightWidth: 1    
  },
  rightContainer: {
    flex: 0.35,  
    backgroundColor: Colors.primaryColorLight
  },
   productsList: {
    // spacing = paddingHorizontal + ActionProductCardHorizontal margin = 12 + 4 = 16
    //paddingHorizontal: 2,
    paddingBottom: 16
  },
   sideButton:{
    marginTop: 4,
    borderWidth: 1
  },
  categoriesContainer: {
    paddingBottom: 2,   
   backgroundColor: Colors.secondaryColor
  },
  cardEmpty: {
    flex: 1,
    marginBottom: 0,
    marginHorizontal: 4,
    paddingHorizontal: 4,
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
    height: 42,
    borderRadius: 4
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
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
  },});

export default inject('feathersStore')(observer(HomeScreen));
