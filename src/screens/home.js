import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  BackHandler,
  Alert,
  NativeModules,
  Linking,
  NativeEventEmitter,
  TouchableOpacity
} from 'react-native';
import NumericKeyboard from '../components/NumericKeyboard';
import NumericKeyboardTablet from '../components/NumericKeyboardTablet';
import InvoiceDataModal from "../components/modals/InvoiceDataModal";
import TouchableItem from "../components/TouchableItem";
import ProductOrderedListItem from "../components/ProductOrderedListItem";
import ProductOrderedListItemTablet from "../components/ProductOrderedListItemTablet";
import {getStatusBarHeight} from 'react-native-status-bar-height';
import {shadowDefault} from '../utils/shadow';
import axios from 'axios';
import Colors from "../theme/colors";
import ActivityIndicatorModal from "../components/modals/ActivityIndicatorModal";
import {useRealm, useQuery } from '@realm/react';
import Button from "../components/buttons/Button";
import ButtonTablet from "../components/buttons/ButtonTablet";
import FakeButton from "../components/buttons/FakeButton";
import FakeButtonTablet from "../components/buttons/FakeButtonTablet";
import Icon from "../components/Icon";
import cloneDeep from 'lodash/cloneDeep';
import CancelItemModal from "../components/modals/CancelItemModal";
import InvoiceTypeModal from "../components/modals/InvoiceTypeModal";
import TcpSocket from 'react-native-tcp-socket';
import {EscPos} from '@tillpos/xml-escpos-helper';
import {pickLanguageWord} from '../utils/pickLanguageWord.js';
import { AppSchema } from "../services/receipt-service";
import ErrorModal from "../components/modals/ErrorModal";
import InfoModal from "../components/modals/InfoModal";
import PayingModal from "../components/modals/PayingModal";
import { v4 as uuidv4 } from 'uuid';

import BleManager from 'react-native-ble-manager';
import { handleGetConnectedDevices, writeToBLE, sendPayment } from "../services/print-service.js";

import { inject, observer } from "mobx-react";

import useTranslate from '../hooks/useTranslate';

const checkIcon = "checkmark";
const checkIconCircle = "checkmark-circle-outline";
const arrowBackCircle = "arrow-back-circle-outline";
const arrowForwardCircle = "arrow-forward-circle-outline";
const chevronDownIcon = "chevron-down";
const downArrow = "caret-down";
const upArrow = "caret-up";

const DEFAULT_EMAIL = "defaultUser@gmail.com";

const {VivaModule, MyPosModule, MyPosProModule} = NativeModules;

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const HomeScreen = ({navigation, route, feathersStore}) => { 

  const realm = useRealm();
  const realm_counter = useQuery("Counter");
  const realm_sections = useQuery('Section');
  const realm_company = useQuery("Company");
  const realm_unprinted = useQuery('Unprinted');
  const realm_users = useQuery('User');

  let common = useTranslate(feathersStore.language);
 
  const [orderItems, setOrderItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [unpaid, setUnpaid] = useState(0);  
  const [price, setPrice] = useState("0");
  const [cash, setCash] = useState("0");
  const [cashToPay, setCashToPay] = useState("0");
  const [change, setChange] = useState("0");
  const [issuingReceipt, setIssuingReceipt] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [indexToCancel, setIndexToCancel] = useState(null);
  const [enterPrice, setEnterPrice] = useState(true); 
  const [cashPaying, setCashPaying] = useState(false);
  const [visaPaying, setVisaPaying] = useState(false);
  const [nativePosPaying, setNativePosPaying] = useState(false);
  const [invoiceTypeModal, setInvoiceTypeModal] = useState(false);
  const [invoiceDataModal, setInvoiceDataModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false) ;
  const [sectionsShowing, setSectionsShowing] = useState([]);
  const [backIndex, setBackIndex] = useState(0);
  const [forwardIndex, setForwardIndex] = useState(0);
  const [myPosError, setMyPosError] = useState(false);
  const [myPosErrorMessage, setMyPosErrorMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [bleReq, setBleReq] = useState(null);
  const [checkingVisa, setCheckingVisa] = useState(false);
 
  useEffect( () => { //Check for updates  
    checkForUpdates();
  }, []);

  useEffect(() => {
    if(feathersStore?.loggedInUser?.ble){
      let stopListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
        async (status) => {
          let reason = "";
          switch(status.status){
            case 10: reason = "Timed out";
            break;
          }
          await handleGetConnectedDevices();        
          setIsScanning(false);
          console.log('Scan is stopped: ', status, reason);
        },
      );
      let disconnectListener = BleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
          (status) => {
            console.log('BleManagerDisconnectPeripheral:', status);

            if(status?.peripheral == feathersStore.bleId)  {
              feathersStore.setBleDisconnected(true);
              setErrorModal(true);
            }          
          },
        );   
      let stateListener = BleManagerEmitter.addListener("BleManagerDidUpdateState", (state) => {
          console.log("State:", state)
        });
      startScan();
    }
    return () => {
      BleManagerEmitter.removeAllListeners("BleManagerStopScan");
      BleManagerEmitter.removeAllListeners("BleManagerDisconnectPeripheral");
    };
  }, [feathersStore?.loggedInUser]);

  const startScan = async() => {
    try{
      setIsScanning(true);
      await BleManager.scan([], 5, true);      
      console.log('Scanning...');
    }catch(error){
      setIsScanning(false);
      console.error(error);
    };
  }

  useEffect(() => {
    const asyncFn = async() => {
      if(bleReq && !isScanning){
        if(feathersStore.bleDisconnected){  
          setIssuingReceipt(false);
          setErrorModal(true);
        }else  {
          setErrorModal(false);
          await writeToBLE(bleReq, realm_company[0].printerIp);
          setBleReq(null);
        }
      };     
    }    
    asyncFn();
  }, [bleReq, isScanning, feathersStore.bleDisconnected])

  useEffect( () => { //Check for updates
    let _sectionsShowing = [];
    if(realm_sections.length > 3){
      for(let i = 0; i < 4; i++)_sectionsShowing.push(realm_sections[i]);      
      setBackIndex(0);
      setForwardIndex(3);
    }else if(realm_sections.length > 0){
      for(let i = 0; i < realm_sections.length; i++)_sectionsShowing.push(realm_sections[i]);
      setBackIndex(0)
      setForwardIndex(realm_sections.length - 1);
    }else{
      setBackIndex(0);
      setForwardIndex(0);
    }
    setSectionsShowing(_sectionsShowing);
  }, [realm_sections]);

  useEffect( () => { 
    sendBackup();
  }, [realm_sections, feathersStore?.isAuthenticated]);

  useEffect( () => { 
    if(feathersStore.loggedInUser.email !== DEFAULT_EMAIL){
      feathersStore.setNativePos(feathersStore.loggedInUser?.terminal?.embedded || false)};
  }, [feathersStore?.loggedInUser]);

  const sendBackup = async() => {
    if(realm_sections?.length > 0){ // Check if there is a backup
      const backup = {
        date: new Date().getTime(),
        receipt: realm?.objects("Receipt"),
        language: realm.objects("Language"),
        counter: realm_counter,
        user: realm.objects("User"),
        company: realm_company,
        section:  realm_sections,      
      }
      await feathersStore.patchUser({backup})  
    }
  }

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {     
        
        // Prevent default behavior of leaving the screen
        if(!feathersStore.demoModeToggled){
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
        }else{
          feathersStore.setDemoModeToggled(false);
        }
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

  const selectAll = () => {
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
  } 

  useEffect(() => {
    let _change = cash - cashToPay;
    if(_change < 0)_change = 0;
    setChange(parse_fix(_change).toString())
  }, [cash, cashToPay])  

  const deleteItem = index => () => {  
    setCancelModalVisible(true); 
    setIndexToCancel(index);   
  }

  const cancelItem = () => {
    const itemPrice =  parseFloat((orderItems[+indexToCancel].product_totalPrice).toFixed(2));
    setOrderItems(prevVal => {
      let orderItemsClone = cloneDeep(prevVal);
      orderItemsClone.splice(+indexToCancel, 1);
      return orderItemsClone;
    });
    if(orderItems[+indexToCancel]?.toBePaid)setCashToPay(prevVal => parse_fix(+prevVal - itemPrice).toString());
    setTotal(prevVal => prevVal - itemPrice);
    setUnpaid(prevVal => prevVal - itemPrice);  
    setCancelModalVisible(false);
  }  
  
  const sectionBtnPressed = (item) => () => {
    setPrice("0");
    const {underlyingValue, vatAmount} = calculateNetPrice(item)
    const product = {
      name: item.name,
      nameEnglish: item.nameEnglish,
      product_totalPrice: parseFloat(price),
      color: item.color,
      vatId: item.vat,
      vatLabel: getVat(item.vat),
      vatAmount,
      underlyingValue
    }
    
    setOrderItems(prevVal => {
      let orderItemsClone = cloneDeep(prevVal);
      orderItemsClone.push(product);
      return orderItemsClone;
    });
    setTotal(prevVal => +prevVal + +price);
    setUnpaid(prevVal => +prevVal + +price);    
  } 
  
  const setCharacterInput = (ch) => () => {      
   
    if(enterPrice){
      if(ch === "." && price.includes("."))return;
      setPrice(oldVal => {
      let priceString = oldVal + ch;
      if(+priceString >= 1){
        if(priceString[0] === "0")priceString = priceString.slice(1);       
      }
      return priceString;
      });
    }else{  
      if(ch === "." && cash.includes("."))return;
      let priceString = "";
      setCash(oldVal => {      
        priceString = oldVal + ch;
        if(+priceString >= 1){
          if(priceString[0] === "0")priceString = priceString.slice(1);       
        }
        return priceString;
      });
    }       
  }

  const setBackspace = () => () => {
    if(enterPrice){    
      if(price.length === 1)setPrice("0");
      else setPrice(oldVal => oldVal.slice(0, -1));
    }else{
      let priceString = "";
      if(cash.length === 1){
        setCash("0");
        priceString = "0"
      }else setCash(oldVal => {
        priceString = oldVal.slice(0, -1);
        return priceString;
      });
    }
  }

  const receivedPressed = () => {
    setEnterPrice(false)
  }

  const toggleEnterPrice = () => {
    setEnterPrice(oldVal => !oldVal)
  }

  const clrPressed = () => {
    if(enterPrice)setPrice("0");
    else{
      setCash("0");
      setChange("0");
    }   
  }

  const pricePressed = () => {
    setEnterPrice(true)
  }

  const resetCashInputs = () => { 
    setCashToPay("0");
    setChange("0");
    setCash("0");   
  } 

  const backPressed = () => {
    if(backIndex > 0){
      let _sectionsShowing = [];
      for(let i = backIndex - 1; i < forwardIndex; i++)_sectionsShowing.push(realm_sections[i]);
      setSectionsShowing(_sectionsShowing);
      setBackIndex(oldVal => oldVal - 1);
      setForwardIndex(oldVal => oldVal - 1);
    }
  }

  const forwardPressed = () => {
    if(forwardIndex < realm_sections.length - 1){
      let _sectionsShowing = [];
      for(let i = backIndex + 1; i < forwardIndex + 2; i++)_sectionsShowing.push(realm_sections[i]);
      setSectionsShowing(_sectionsShowing);
      setBackIndex(oldVal => oldVal + 1);
      setForwardIndex(oldVal => oldVal + 1);
    }
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
    return AppSchema.colorsArray.find(color => color.id === id)?.value || ""
  }

  const findInvoiceType = () => {
    return AppSchema.invoiceTypes.find(it => it.name === feathersStore.invoiceType)
  }

  const getVat = id => {
    return AppSchema.vatsArray.find(v => +v.id === +id)?.label.toString().padStart(2, '0') + "%"
  }

  const calculateNetPrice = (item) => {
    const label =  AppSchema.vatsArray.find(v => +v.id === +item.vat)?.label;
    const underlyingValue =  Math.round(((price / (1 + (label / 100) )) + Number.EPSILON) * 1000) / 1000 ;
    const vatAmount = price - underlyingValue;
    return {underlyingValue: +underlyingValue.toFixed(2), vatAmount}; 
  }
  
  const setNumericId = () => {
    let numericId = 1;   
    if(realm_counter?.length > 0){
      numericId = +realm_counter[0][`${feathersStore.invoiceType}`] + 1;
      realm.write(()=>{     
        realm_counter[0][`${feathersStore.invoiceType}`] = numericId;      
      })
    }else{    //init
      realm.write(()=>{     
        realm.create('Counter', {[`${feathersStore.invoiceType}`]: 1});
      })
    }
    
    return numericId;
  } 

  const calculateVats = items => {    
    let vatsObj = {}
    for(let vat of AppSchema.vatsArray){
      let vatAmount = items.filter(item => +item.vatId === +vat.id)
        .map(i => i.vatAmount)        
        .reduce((a,b) => (+a + +b), 0).toFixed(2);
      let underlyingValue = items.filter(item => +item.vatId === +vat.id)
        .map(i => i.underlyingValue)        
        .reduce((a,b) => (+a + +b), 0).toFixed(2);
    Object.assign(vatsObj, {[`vat${vat.id}`]: {vatId: +vat.id, vatAmount, underlyingValue}})
    }  
    return vatsObj;
  }

  const openMyDataErrorAlert = () => {
    Alert.alert( `${pickLanguageWord(feathersStore.language, "myDataError")}`, 
    `${pickLanguageWord(feathersStore.language, "retry")}`,[
      {
        text: `${pickLanguageWord(feathersStore.language, "cancel").toUpperCase()}`,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      }],
      {cancelable: false},
    );
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

  const renderProductListItemTablet = useCallback(
    (item, index) => (      
      <ProductOrderedListItemTablet 
        key={index}         
        onPress={togglePayment(item, index)}    
        onPressDelete={deleteItem(index)}
        title={feathersStore._translate(item.name , item.nameEnglish)}     
        price={parse_fix(item.product_totalPrice)}     
        paid={item.paid}  
        toBePaid={item.toBePaid} 
      />
  ), []);

  const payMyPos = async() => {       
    let index = realm_users.findIndex(user => user.nameEnglish === feathersStore.loggedInUser.nameEnglish);
    if(index < 0)index = 1; 
    const code = index.toString().padStart(4, "0");
    await makeMyPosPayment(+cashToPay, code, "myPos-Order");
  }

  const closeMyPosErrorModal = () => {
    setMyPosError(false);
    setMyPosErrorMessage("");
  }

  const makeMyPosPayment = async(amount, waiter, table) => {  
    try{    
      const tippingModeEnabled = false;
      const transactionResult = 
      feathersStore.loggedInUser?.terminal?.type === "PRO"
      ? 
        await MyPosProModule.makeMyPosPayment(amount, tippingModeEnabled, 0, waiter, table)
      :     
        await MyPosModule.makeMyPosPayment(amount, tippingModeEnabled, 0, waiter, table)
      ;
      if(transactionResult.myResponse.slice(-1) === "0") {        
        // Transaction is successful     
        if(feathersStore.loggedInUser?.ble)await printVisaReceipt(transactionResult, amount); 
        if(feathersStore.loggedInUser?.myPosPro){
          //print receipt in MyPosPro
        }else await issueReceiptFn("VISA")     //TODO: Add payment object 
      }else{
        console.log("ERROR: ", transactionResult);      
        setMyPosError(true);
        setMyPosErrorMessage(transactionResult.myResponse);
      }
    }catch(error){
      setMyPosError(true);
      setMyPosErrorMessage(error.toString());
    }
  }

  
  const printVisaReceipt = async(response, amount) => {

    /* RESPONSE EXAMPLE
   const response = {
      "CVM": "P", 
      "STAN": null, 
      "TID": "90477302", 
      "TSI": null, 
      "TVR": null, 
      "application_name": "Visa DEBIT", 
      "card_brand": "PAYWAVE", 
      "card_entry_mode": "ENTRY_MODE_CONTACTLESS_MCHIP", 
      "cardholder_name": "", 
      "date_time": "240514200202", 
      "myResponse": "Payment transaction has completed. Result: 0", 
      "rrn": "413517637866", 
      "signature_required": false, 
      "status_text": "TRANSACTION_SUCCESS", 
      "transaction_approved": true
    }
    */

    const date =  response.date_time.substring(4,6) + "/" + 
                  response.date_time.substring(2,4) + "/20" +
                  response.date_time.substring(0,2);

    const time = response.date_time.substring(6,8) + ":" + 
                  response.date_time.substring(8,10) + ":" +
                  response.date_time.substring(10,12);
    
    req =  
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<document>' +
      '<set-cp/>' +
      '<align mode="center">' +
        constructCompanyTitleMyPos() +             
      '<line-feed />' +
      '<bold>' +  
        `<text-line>${date} ${time}</text-line>` +                           
        `<text-line>ΑΓΟΡΑ-SALE: </text-line>` +     
        `<text-line>${parse_fix(+amount)} EUR</text-line>` +                 
      '</bold>' +
      '<line-feed />' + 
        `<text-line>${response.application_name}</text-line>` + 
        `<text-line>${response.card_entry_mode}</text-line>` +
        `<text-line>${response.signature_required ? 'Signature required' : 'No Signature Required'}</text-line>` +
        '<line-feed />' +
        `<text-line>${response.transaction_approved ? 'Transaction approved' : 'Transaction not approved'}</text-line>` +
      '</align>' +
      '<line-feed />' +
      '<align mode="left">' +
        `<text-line>TID: ${response.TID}</text-line>` + 
        `<text-line>RRN: ${response.rrn}</text-line>` + 
      '</align>' +
      '<align mode="center">' +                 
      `<text-line>${feathersStore.loggedInUser?.name}</text-line>` +
      '</align>' +
      '<line-feed />' +                     
      '<paper-cut />' +
    '</document>' ;

    if(feathersStore.bleDisconnected){        
      await startScan();
      setBleReq(req)     
    }else{
      await writeToBLE(req, realm_company[0].printerIp);
    }
  } 

  const payVisa = async() => {
    !feathersStore.nativePos && setVisaPaying(true);
    try{
      setCashPaying(false);
      let paymentAmounts = calculatePaymentAmounts();      
      Object.assign(paymentAmounts, {tip: 0});
      try{
        const activeUid = uuidv4();
        const response = await sendPayment(activeUid, paymentAmounts, feathersStore?.nativePos);
          if(response && feathersStore?.nativePos){
            if(feathersStore?.loggedInUser?.terminal?.make === "MYPOS")await payMyPos();
            else await makeVivaNativePayment(Math.round(paymentAmounts.paidSum * 100).toString(), 
             response)
          }else if(response?.sessionId){
            paymentSessionIdRef.current = response?.sessionId;
          }else{           
            openMyDataErrorAlert();
        }
      }catch(error){
        console.log(error)
        openMyDataErrorAlert();
      }           
    }catch(error){
      console.log(error);
      setVisaPaying(false);
    } 
  }  

  const makeVivaNativePayment = async(amount, payload) => {  
    setNativePosPaying(true)
    try{              
      
      const clientTransactionId = uuidv4(); 

      let _isvAmount = 0;
      if(feathersStore.loggedInUser?.ISV_amount > 0){
        let coef = feathersStore.loggedInUser?.ISV_amount / 10000;            
        _isvAmount = Math.round(amount * coef);
        if(_isvAmount < 2)_isvAmount = 2;
      }

      const isvAmount = _isvAmount > 0 ? _isvAmount.toString() : "OFF";
      const clientId = feathersStore.loggedInUser?.ISV_clientId || "OFF";
      const clientSecret = feathersStore.loggedInUser?.ISV_clientSecret || "OFF";
      const merchantSourceCode = feathersStore.loggedInUser?.ISV_merchantSourceCode?.toString() || "OFF";
      

      const response = await VivaModule.makeVivaNativePayment(
        amount, clientTransactionId, payload.inputFormatted, payload.signature,
        isvAmount, clientId, clientSecret, merchantSourceCode);
      //Example response
   //  const response  =  "mycallbackscheme://result?aid=A0000000041010&status=success&message=Transaction successful&action=sale&clientTransactionId=a5d4865e-325a-4878-b3ff-7b20771b2712&amount=100&rrn=429212516667&verificationMethod=CONTACTLESS - NO CVM&cardType=Debit Mastercard&accountNumber=535143******2416&referenceNumber=516667&authorisationCode=516667&tid=16008825&orderCode=4292155155008825&transactionDate=2024-10-18T15:05:55.0790349+03:00&transactionId=9f497a95-1488-4647-ab17-de380696799d&paymentMethod=CARD_PRESENT&shortOrderCode=4292155155&aadeTransactionId=116429212516667516667"
        
      let data = transformVivaResponse(response); 
        
      const payment = {
        PaymentMethodType: "Card",
        PaymentMethodTypeCode: "7",
        PaymentAmount: data.amount / 100,
        PaymentNotes: "Card",
        signature: payload.signature,
        signatureAuthor: "111",
        transactionId: data.transactionId,
        "terminalId": data.tid,
        "tipAmount": data?.tipAmount ? data.tipAmount / 100 : 0,
        //---> Extra fields
        extraFields: {
          status: data.status,
          cashRegisterId: data.sourceTerminalId,
          clientTransactionId: data.clientTransactionId,
          rrn: data.rrn,
          authorisationCode: data.authorisationCode,
          message: data.message,
          referenceNumber: data?.referenceNumber,
          orderCode: data?.orderCode,
          transactionDate: data?.transactionDate,
          aadeTransactionId: data?.aadeTransactionId
        }
      }
     
      if(data?.status === "success") {     
        await issueReceiptFn("Visa", payment);    
        if(feathersStore.loggedInUser?.ble)await printVisaReceipt(data, amount, tip, true);
        setNativePosPaying(false);
      }else{
        console.log("ERROR: ", data);      
        setMyPosError(true);
        setMyPosErrorMessage(data.message);
        setNativePosPaying(false);
      }
    }catch(error){
      console.log("error:", error)
      setMyPosError(true);
      setMyPosErrorMessage(error.toString());
      setNativePosPaying(false);
    }
  }

  const transformVivaResponse = (data) => {
    const dataArray = data.split('&');
    let response = {};
    const firstElementArr = dataArray[0].split("?");
    const first = firstElementArr[1].split("=")
    response[first[0].trim()] = first[1].trim();
    for(let i = 1 ; i < dataArray.length ; i++){
      const elementArr = dataArray[i].split('=');
      response[elementArr[0].trim()] = elementArr[1].trim();
    }   
    return response
  }


  const calculatePaymentAmounts = () => {
    let paidSum = 0;
    let netPaidSum = 0;
    let unReceiptedItems =  orderItems.filter(i => i?.toBePaid);      
    unReceiptedItems?.forEach(listItem =>  {
      paidSum += +listItem.product_totalPrice;
      netPaidSum += +listItem.underlyingValue;
    });    
    const vatPaidSum = paidSum - netPaidSum;
    return {paidSum, netPaidSum, vatPaidSum}
  }

  const checkStatus = async() => {
    try{
      const terminal = feathersStore.loggedInUser.terminal;
      setCheckingVisa(true);
      const response = await feathersStore.getPaymentStatus(paymentSessionIdRef.current, terminal.make, terminal?.mellonApiKey);
      setCheckingVisa(false);
      if(response?.extraFields?.status === 200){        
        setVisaPaying(false);
        await issueReceiptFn("VISA", response);    
      }
    }catch(error){
      console.log(error)
      openVivaErrorAlert();
      setVisaPaying(false);
      setCheckingVisa(false);
    }
  }

  const deletePaymentSession = async() => {
    try{
      const terminal = feathersStore.loggedInUser.terminal;
      if(terminal?.make !== "MYPOS"){
        const params = {cashRegisterId: terminal.terminalMerchantId}
        await feathersStore.deletePaymentSession(paymentSessionIdRef.current, params);
      }
      setVisaPaying(false);
    }catch(error){
      console.log(error)
      openVivaErrorAlert();
      setVisaPaying(false);
    }
  } 

  const cashPayment= async() => {   
    setCashPaying(true); 
    const payment = {
      PaymentMethodType: "ΜΕΤΡΗΤΟΙΣ",
      PaymentMethodTypeCode: 3,
      "PaymentAmount": parseFloat(cashToPay).toFixed(2),
      "PaymentNotes": "ΜΕΤΡΗΤΟΙΣ",
      "signature": "",
      "signatureAuthor": "111",
      "transactionId": "",
      "terminalId": "",
      "tipAmount": "0"
    }  
    await issueReceiptFn("CASH", payment);   
  }  

   const issueReceiptFn = async(paymentMethod, payment) => { 
    if(["tpy", "tda", "pt"].includes(feathersStore.invoiceType)){
      setInvoiceDataModal(true);
    }else{
      await _issueReceipt(paymentMethod, payment);
    }
  }

  const _issueReceipt = async(paymentMethod, payment) => { 
    const companyData = feathersStore.companyData;
    setIssuingReceipt(true);
    const date = new Date(); 
    const day = date.getDate().toString().padStart(2, "0"); 
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const localDate = day + '/' + month + '/' + year;
    const isoTime = hours + ":" + minutes + ":" + seconds;
    let itemsList =""; 
    let vatAnalysis ="";  
    let totalNetPrice = 0.0;   
    let unReceiptedItems =  orderItems.filter(i => i?.toBePaid); 

    let vatAnalysisHeader = 
      '<align mode="left">' +    
      '<text-line>Ανάλυση ΦΠΑ</text-line>' + 
      `<text-line>Συντελεστής` + 
      `<x-position>${feathersStore.loggedInUser.ble ? '141' : '245'}</x-position><text>ΦΠΑ%</text>` +
      `<x-position>${feathersStore.loggedInUser.ble ? '194' : '350'}</x-position><text>ΦΠΑ</text>` +
      `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>Κ. Αξία</text-line>` +
      '</align>';          
      
    for (let item of unReceiptedItems){
      itemsList = itemsList + 
        '<align mode="left">' +
          `<text-line>${item.name}` + 
          `<x-position>${feathersStore.loggedInUser.ble ? '141' : '245'}</x-position><text>${item.vatLabel}</text>` +
          `<x-position>${feathersStore.loggedInUser.ble ? '194' : '350'}</x-position><text>${parse_fix(item.underlyingValue)}</text>` +
          `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(item.product_totalPrice)}<set-symbol-cp>${feathersStore.loggedInUser.ble ? '' : '€'}</set-symbol-cp></text-line>` +
        '</align>';          
    }
    
    const receiptTotal = parseFloat(cashToPay).toFixed(2);

    let receipt ={
      receiptKind: feathersStore.invoiceType,
      numericId: setNumericId(),
      issuer: feathersStore.user.name,
      receiptTotal: parse_fix(receiptTotal),
      receiptDate: localDate,
      receiptTime: isoTime,    
      createdAt: date.getTime(), 
      receiptItems: unReceiptedItems,
      paymentMethod,
      payment,
      cash,
      change     
    };

    if( companyData?.afm )Object.assign(receipt, {companyData})

    const calcVats  = calculateVats([...unReceiptedItems]);
    Object.assign(receipt,  {...calcVats}, {vatAnalysis: JSON.stringify(calcVats)});

    for (let vat of AppSchema.vatsArray){
      if(receipt[`vat${vat.id}`]?.vatAmount > 0){
        vatAnalysis = vatAnalysis +
        '<align mode="left">' +
          `<text-line>Κατ. ΦΠΑ: ${vat.id}` + 
          `<x-position>${feathersStore.loggedInUser?.ble ? '141' : '245'}</x-position><text>${getVat(vat.id)}</text>` +
          `<x-position>${feathersStore.loggedInUser.ble ? '194' : '350'}</x-position><text>${parse_fix(receipt[`vat${vat.id}`].vatAmount)}</text>` +
          `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(receipt[`vat${vat.id}`].underlyingValue)}</text-line>` +
        '</align>'; 
        totalNetPrice = +totalNetPrice + +receipt[`vat${vat.id}`].underlyingValue;
      }
    }
    
    Object.assign(receipt,  {totalNetPrice});

    const response = await constructMyData(receipt);

    //---> Rollback
    if(!response?.qrcode){
      realm.write(()=>{     
        realm_counter[0][`${feathersStore.invoiceType}`] = receipt.numericId - 1;      
      });           
      setIssuingReceipt(false);
      openMyDataErrorAlert();
      return;
    }
    //------->  

    const req =  
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<document>' +
      '<set-cp/>' +
      '<align mode="center">' +
        constructCompanyTitleNonEpos() +             
      '<line-feed />' +
      '<bold>' +                             
        `<text-line>${findInvoiceType().invoiceTypeName}</text-line>` +              
        `<text-line>ΧΕΙΡΙΣΤΗΣ: ${feathersStore.user.name}</text-line>` +
      '</bold>' +
      '</align>' +
      '<line-feed />' +
      '<align mode="left">' +
      `<text-line>${localDate} ${isoTime}</text-line>` +
      `<text-line>ΑΡ. ΠΑΡΑΣΤΑΤΙΚΟΥ: ${receipt.numericId}</text-line>` +     
      '</align>' +
       (companyData?.afm ? 
        '<align mode="center">' +
        `<text-line>${'-------------------------------' + (feathersStore.loggedInUser.ble ? '' :'---------------')}</text-line>` +                
        '</align>' +
        '<align mode="left">' +
        `<text-line>Στοιχεία πελάτη: ${companyData.legalName}</text-line>` +
        `<text-line>ΑΦΜ: ${companyData.afm} ΔΟΥ: ${companyData.doyDescription}</text-line>` +
        '</align>'
      : "")  +
      '<align mode="center">' +
      `<text-line>${'-------------------------------' + (feathersStore.loggedInUser.ble ? '' :'---------------')}</text-line>` +                
      '</align>' +            
          itemsList + 
      '<line-feed />' +         
      '<align mode="center">' +
      `<text-line>${'-------------------------------' + (feathersStore.loggedInUser.ble ? '' :'---------------')}</text-line>` +                
      '</align>' +
        vatAnalysisHeader +
        vatAnalysis +
      '<align mode="left">' +
      `<text-line>Σύνολο:` + 
      `<x-position>${feathersStore.loggedInUser.ble ? '194' : '350'}</x-position><text>${parse_fix(receiptTotal - receipt.totalNetPrice)}</text>` +
      `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(receipt.totalNetPrice)}</text-line>` +
      '</align>' +   
      '<align mode="center">' +
      `<text-line>${'-------------------------------' + (feathersStore.loggedInUser.ble ? '' :'---------------')}</text-line>` +                
      '</align>' +
      '<align mode="left">' +
      `<text-line>${paymentMethod === "VISA" ? "ΚΑΡΤΑ" : "ΜΕΤΡΗΤΑ"}` + 
      `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(paymentMethod === "VISA" ? receiptTotal : cash)}</text-line>` +
      '</align>' +
      '<align mode="center">' +
      `<text-line>${'-------------------------------' + (feathersStore.loggedInUser.ble ? '' :'---------------')}</text-line>` +                
      '</align>' +
      '<align mode="left">' +  
      `<text-line>Σύνολο:` + 
      `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(receiptTotal)}<set-symbol-cp>${feathersStore.loggedInUser.ble ? '' : '€'}</set-symbol-cp></text></text-line>` +  
      (paymentMethod === "CASH" ?
      '<open-cash-drawer/>' +
      `<text-line>Ρέστα:` + 
      `<x-position>${feathersStore.loggedInUser.ble ? '286' : '455'}</x-position><text>${parse_fix(change)}<set-symbol-cp>${feathersStore.loggedInUser.ble ? '' : '€'}</set-symbol-cp></text></text-line>`
      : "") +  
      '<line-feed/>' +   
      '</align>' +  
      '<align mode="center">' +   
        `<qrcode ecl="M" size="4">${response?.qrcode}</qrcode>` +    
      '</align>' +         
      '<line-feed/>' +    
      `<text-line>${response?.footer}</text-line>` +
      '<line-feed/>' +                       
      (feathersStore.loggedInUser?.ble ? '' : '<paper-cut/>') +
    '</document>' ;
    
    if(feathersStore.loggedInUser?.ble){
      if(feathersStore.bleDisconnected){        
        await startScan();
        setBleReq(req)     
      }else{
        await writeToBLE(req, realm_company[0].printerIp);
      }      
    }else await printLocally(req);
    Object.assign(receipt, {footer: response.footer, req});
    
    //--------> Persist in Realm

    Object.assign(receipt, {
      numericId: feathersStore.invoiceType + "_" + receipt.numericId.toString(),
      receiptItems: JSON.stringify(receipt.receiptItems)
    })
    realm.write(()=>{     
      realm.create('Receipt', receipt);
    });

    //------------>
    setTotal(prevVal => prevVal - receiptTotal);
    setUnpaid(prevVal => prevVal - receiptTotal);
    resetCashInputs();
    for(let listItem of orderItems){
      if(listItem.toBePaid)Object.assign(listItem, {paid: true, toBePaid: false});
    }
    if(orderItems.filter(item => item?.paid)?.length === orderItems?.length)setOrderItems([]);
    setIssuingReceipt(false);
  }

  const constructCompanyTitleNonEpos = () => {
    return(
      `<bold><text-line size="1:1">${realm_company[0].name}</text-line></bold>` +
      '<line-feed />' +
      `<bold><text-line>${realm_company[0]?.legalName || realm_company[0].name}</text-line></bold>` +
      '<line-feed />' +
      '<bold>' +
        `<text-line>${realm_company[0].postalAddress} ${realm_company[0].postalAddressNo} ${realm_company[0].postalAreaDescription} ${realm_company[0].postalZipCode}</text-line>` + 
        `<text-line>ΑΦΜ: ${realm_company[0].afm} ΔΟΥ ${realm_company[0].doyDescription}</text-line>` +
        `<text-line>${realm_company[0].firmActDescription}</text-line>` +
        (realm_company[0].companyPhone ? `<text-line>ΤΗΛ: ${realm_company[0].companyPhone}</text-line>` : '') +
        (realm_company[0].companyEmail ? `<text-line>E-mail: ${realm_company[0].companyEmail}</text-line>` : '') +
      '</bold>'
    )
  }

  const constructCompanyTitleMyPos = () => {
    return(
      `<bold><text-line size="1:1">MyPos</text-line></bold>` +
      '<line-feed />' +
      `<bold><text-line>${realm_company[0]?.legalName || realm_company[0].name}</text-line></bold>` +
      '<bold>' +
        `<text-line>${realm_company[0].postalAddress} ${realm_company[0].postalAddressNo} ${realm_company[0].postalAreaDescription} ${realm_company[0].postalZipCode}</text-line>` + 
        `<text-line>ΑΦΜ: ${realm_company[0].afm} ΔΟΥ ${realm_company[0].doyDescription}</text-line>` +
        `<text-line>${realm_company[0].firmActDescription}</text-line>` +
        (realm_company[0].companyPhone ? `<text-line>ΤΗΛ: ${realm_company[0].companyPhone}</text-line>` : '') +
        (realm_company[0].companyEmail ? `<text-line>E-mail: ${realm_company[0].companyEmail}</text-line>` : '') +
      '</bold>'
    )
  }

  const constructMyData = async(persistedReceipt) => {

    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0"); 
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const isoDate = year + "-" + month + "-" + day;       
    const isoTime = hours + ":" + minutes + ":" + seconds;

    let details = [];
    let vatAnalysis = [];

    let payment = cloneDeep(persistedReceipt?.payment);
    delete payment?.extraFields; //===> delete extra fields

    persistedReceipt.receiptItems.forEach((item, index) => {
     
      let detailObject =
      {
        "LineNumber": +index + 1,
        "Barcode": "",
        "Name": `${item.name} || ""}`, 
        "Quantity": 1,
        "Notes": "",
        "AdditionalNotes": "", 
        "Total": +parse_fix(item.underlyingValue),       
        "VATAmount": +parse_fix(item.vatAmount),
        "VATPerc": AppSchema.vatsArray.find(v => +v.id === +item.vatId)?.label,
        "TotalWithVAT": +parse_fix(item.product_totalPrice),
        "UnitPrice": +parse_fix(item.underlyingValue),
        "UnitDesc": 0,
        "IncomeCode": "category1_1",
        "EInvoiceIncomeClassTypeCode": "E3_561_003",
        "ExpenseCode": "",
        "EInvoiceExpenseClassTypeCode": null,
        "ReasonForTaxExp": "15",
        "VatCategory": +item.vatId,
        "MeasurementUnit": "1",
        "withheldAmount": 0.0,
        "withheldPercentCategory": null,
        "stampDutyAmount": 0.00,
        "stampDutyPercentCategory": null,
        "feesAmount": 0.0,
        "feesPercentCategory": null,
        "otherTaxesAmount": 0.0,
        "otherTaxesPercentCategory": null,     
      }      

      details.push(detailObject);     

    })

  
    for(let vat of AppSchema.vatsArray){
      const label = AppSchema.vatsArray.find(v => +v.id === +vat.id)?.label
      if(persistedReceipt[`vat${vat.id}`] != 0){
        vatAnalysis.push({
          "Name": label + "%",
          "Percentage": +label,
          "VatAmount": +persistedReceipt[`vat${vat.id}`].vatAmount,
          "UnderlyingValue": +persistedReceipt[`vat${vat.id}`].underlyingValue
        })
      }      
    } 

    const totalNetAmount = persistedReceipt.totalNetPrice;

    const body = 
    {
      "ActionTypeId": 1,
      "InvoiceDate": isoDate,
      "InvoiceTypeCode": findInvoiceType().id,
      "InvoiceTypeName": findInvoiceType().invoiceTypeName,
      "InvoiceTypeSeries": `${persistedReceipt.numericId}`,
      "InvoiceTypeSeriesName": "",
      "InvoiceTypeNumber": findInvoiceType().invoiceTypeNumber,
      "InvoiceTypeNumberName": findInvoiceType().invoiceTypeNumberName,
      "Currency": "EURO",
      "CurrencyCode": "EUR",
      "IsRetailInvoice": true,
      "IsDelayedInvoice": false,
      "transmissionFailure": "",
      "DelayedDocumentID": "",
      "selfPricing": false,
      "SubmissionToMyDATA": true,
      "vatPaymentSuspension": false,
      "CorrelatedInvoices": "",
      "distributionInfo": null,
      "dispatchDate": isoDate,
      "dispatchTime": isoTime,
      "vehicleNumber": null,
      "WebOrderNumber": null,
      "StoreComments": "",
      "CustomerComments": "",
      "movePurpose": 1,
      "ShippingMethod": "COURIER",
      "Issuer": {
        "CompanyName": `${realm_company[0].name}`,
        "CompanyLegalName": `${realm_company[0]?.legalName || realm_company[0].name}`,
        "CompanyActivity":  `${realm_company[0]?.firmActDescription}`,
        "CompanyAddress": {
          "Country": "GR",
          "CountryCode": "GR",
     //     "Region":  `${feathersStore.settings[0].taxAddress?.region}`,
          "City":  `${realm_company[0]?.postalAreaDescription}`,
          "Municipality":  `${realm_company[0]?.postalAreaDescription}`,
          "Street":  `${realm_company[0]?.postalAddress}`,
          "Number":  `${realm_company[0]?.postalAddressNo}`,
          "Postal":  `${realm_company[0]?.postalZipCode}`
        },
        "CompanyPhones": [
          `${realm_company[0]?.companyPhone}`
        ],
        "CompanyEmails": [
          `${realm_company[0]?.companyEmail}`
        ],
        "CompanyCurrency": "€",
        "CompanyVatNumber": `${realm_company[0].afm}`,       
        "CompanyTaxAuthority": `ΔΟΥ ${realm_company[0].doyDescription}`,
        "CompanyBranch": "0",
        "CompanyBranchCode": "",
        "CompanyPosId": ""         
      },       
      "Payment": payment?.length > 0 ? payment :
        [
          {
            "PaymentMethodType": "ΜΕΤΡΗΤΟΙΣ",
            "PaymentMethodTypeCode": 3,
            "PaymentAmount": +parse_fix(persistedReceipt.receiptTotal),
            "PaymentNotes": "ΜΕΤΡΗΤΟΙΣ"
          }
        ]            
      ,   
      "lstLineItem": details,    
      "Summary": {
        "totalNetValue": totalNetAmount,
        "totalWithheldAmount": 0.00,
        "totalFeesAmount": 0.00,
        "totalStampDutyAmount": 0.00,  
        "TotalVATAmount": (persistedReceipt.receiptTotal - totalNetAmount).toFixed(2),
        "totalOtherTaxesAmount": 0.00,
        "totalDeductionsAmount": 0.00,
        "totalGrossValue": persistedReceipt.receiptTotal,
        "totalAllowances": 0.00,
        "totalAllowancesWithoutLines": 0.00,
        "totalCharges": 0.00,
        "totalSpecialCharges": 0.00      
   //     "TotalPayableAmount": persistedReceipt.receiptTotal
      },    
      "VatAnalysis": vatAnalysis,
      "AllowancesCharges": [
        {
          "Type": "",
          "Description": "",
          "Code": "",
          "Amount": 0.00,
          "VatPercentage": 0.00,
          "VatAmount": 0.00
        }
      ],       
      "SendMethod": "0",
      "CustomField1": `${persistedReceipt.numericId}`,
      "Email": [
          "support@simplypos.com"
      ]
    } 

    if(persistedReceipt.companyData?.afm)Object.assign(body, {
      "Customer": {
        "CustomerName": `${persistedReceipt.companyData.legalName}`,
        "CustomerActivity": `${persistedReceipt.companyData.firmActDescription}`,
        "CustomerAddress": {
            "Country": "ΕΛΛΑΔΑ",
            "CountryCode": "GR",
            "City": `${persistedReceipt.companyData.postalAreaDescription}`,
            "Street": `${persistedReceipt.companyData.postalAddress}`,
            "Number": `${persistedReceipt.companyData.postalAddressNo}`,
            "Postal": `${persistedReceipt.companyData.postalZipCode}`
        },
        "DeliveryAddress": {
            "Country": "ΕΛΛΑΔΑ",
            "CountryCode": "GR",
            "City": `${persistedReceipt.companyData.postalAreaDescription}`,
            "Street":`${persistedReceipt.companyData.postalAddress}`,
            "Number": `${persistedReceipt.companyData.postalAddressNo}`,
            "Postal": `${persistedReceipt.companyData.postalZipCode}`
        },
        "CustomerPhones": [
          `${persistedReceipt.companyData?.companyPhone || ""}`
        ],
        "CustomerEmails": [
          `${persistedReceipt.companyData?.companyEmail || ""}`
        ],
        "CustomerCurrency": "EURO",
        "CustomerVatNumber": `${persistedReceipt.companyData.afm}`,
        "CustomerTaxAuthority": `${persistedReceipt.companyData.doyDescription}`,
        "CustomerManualNumber": `${persistedReceipt.companyData?.companyPhone || ""}`,
        "CustomerMobile": `${persistedReceipt.companyData?.companyPhone || ""}`,
          "CustomerBranch": "0",      
      }
    })
    
    try{
      const payload = {
        body,
        userId: feathersStore.loggedInUser._id
      }
      const response = await feathersStore.postToMyData(payload);     
      if(response?.data?.invoiceURL){
          return {       
          qrcode:  `${response.data.invoiceURL}`,
          footer: `${response.data.invoiceMark} ${response.data.invoiceUid} ${response.data.authenticationCode}`
        } 
      }else{
        console.log(response);
        await logError(response, persistedReceipt);
        setIssuingReceipt(false);
        return;
      } 
      }catch(error){
        console.log(error);
        await logError(error, persistedReceipt);
        setIssuingReceipt(false);
        return;
    }   
  }
  const printLocally = (req) => {

      const PORT = 9100;
    const ip = realm_company[0].printerIp;   
    console.log( realm_company[0].printerIp)
   
    const options = {
      port: 9100,   //connect to
      host: ip,   //connect to
  //    localAddress: ip, //connect from
      reuseAddress: true,
      // localPort: 20000,    //connect from
      // interface: "ethernet",
    }
    const make = "zywell";

/*
    //-------> TEST
    const req =`
    <?xml version="1.0" encoding="UTF-8"?>
    <document>
    <set-cp/>
      <align mode="center">
        <bold>
          <text-line size="1:0">TEST 2 <set-symbol-cp>€</set-symbol-cp></text-line>
        </bold>
      </align>
      <align mode="left">
        <text-line size="0:0">\u03b1 DUCEROAD duceroad</text-line>  
        <x-position>100</x-position><text>Move 100</text>
        <bold><text-line size="0:0">αβγ</text-line></bold>
        <text-line size="0:0">abcdefghijklmnopqrstuvwxyz</text-line>     
        <text>αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ</text>
       <text>αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ</text>
      </align>        
      <line-feed />        
      <paper-cut />
    </document>
  `
//---------> TEST END
*/

    return new Promise((resolve, reject) => {

      const buffer = EscPos.getBufferFromXML(req, make);

      let device = new TcpSocket.Socket();

      device.connect(options, () => {
        if(realm_unprinted?.length > 0){
          realm_unprinted.forEach(async item =>  await this.printLocally(item?.req));
          realm.write(()=>{ 
            realm.delete(item)                        
          }); 
        };  
        device.write(buffer);
        device.emit("close");
      });

      /*

      const device = TcpSocket.createConnection(options, () => {  
        if(realm_unprinted?.length > 0){
          realm_unprinted.forEach(async item =>  await this.printLocally(item?.req));
          realm.write(()=>{ 
            realm.delete(item)                        
          }); 
        };  
        device.write(buffer);
        device.emit("close");
      });
*/
      device.on("close", () => {
        if(device) {
          device.destroy();
          device = null;
        }
        resolve(true);
        return;
      });

      device.on("error", async(error) => {
        console.log(`Network error occured. `, error.toString());
        if(error.toString().includes("ECONNREFUSED")){ //After restart printer gets stuck and needs retries   
          console.log('Restart'); 
          device.destroy();
          device = null;
          await this.printLocally(req);   //TODO: Retry up to 10 times   
        }else if(error.toString().includes("ETIMEDOUT")){ //if printer is offline
          realm.write(()=>{     
            realm.create('Unprinted', {req}); 
          }) 
        }
        setErrorModal(true);
        return;
      });   
    });    
  }; 

  const logError = async(error, persistedReceipt) => {
    const payload = {
      vendor: realm_company[0].vendor,
      errorKind: "my_data",
      origin: "androidPDA",
      file: "Pay.js",
      line: "980",
      error,
      persistedReceipt
    }
    await feathersStore.createLogEntry(payload)
  }

  const parse_fix = price => {
    return price ? parseFloat(price).toFixed(2) : 0;
  } 

  const openInvoiceTypeModal = () => {
    setInvoiceTypeModal(true);
  }

  const closeInvoiceTypeModal = () => {
    setInvoiceTypeModal(false);
  }

  const closeInvoiceDataModal = () => {
    setInvoiceDataModal(false);
  }

  const closeErrorModal = () => {    
    setErrorModal(false); 
  };

  const closeIssuingReceiptModal = () => {    
    setIssuingReceipt(false); 
  };
   
  const headerComponent = () => (
    <View style={styles.header}>     
      <Text onPress={goToPlayStore} style={styles.newVersion}>
        {common?.newVersion}
      </Text>
    </View>
  );

  const demoModeComponent = () => (
    <View style={styles.header}>     
      <Text style={styles.demoMode}>
        {common?.demoMode}
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    header: {
      marginTop: 5,
      marginHorizontal: 5  
    },
     screenContainer: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: getStatusBarHeight(),
    },  
    container: {
      flex: 1,
      flexDirection: "row"
    },
    leftContainer: {
      flex: 0.65,
     // backgroundColor: Color(Colors.overlayColor).alpha(0.2).string(),
      backgroundColor: Colors.surface,
      borderRightWidth: 1    
    },
    rightContainer: {
      flex: 0.35,  
      backgroundColor: Colors.surface
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
    sideButtonTablet:{
      marginTop: 8,
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
    demoMode: {
      backgroundColor: Colors.accentColor ,    //'#ccd'
      fontSize: 14,
      color: Colors.onAccentColor,  //'#333'
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
    },
    keyboardContainer: {
      width: "100%",
      flexDirection: "row"
    },
    keyboardRight: {
      flexDirection: "row",
      width: "40%",
      flexWrap: "wrap",
      justifyContent: "space-around",
      paddingVertical: feathersStore.isTablet ? 8 : 4,
      backgroundColor: Colors.itemBkgr,
      paddingRight: feathersStore.isTablet ? 4 : 2
    },
    keyboardButton: {
      width: "44%",
      height: feathersStore.isTablet ? 82 : 48,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      backgroundColor: Colors.keyboardButton,
      marginLeft: feathersStore.isTablet ? 8 : 4,
      marginVertical: feathersStore.isTablet ? 8 : 4,
      paddingLeft: feathersStore.isTablet ? 12 : 8,
      paddingTop: feathersStore.isTablet ? 4 : 2 
    },
    greenButton: {
      width: "44%",
      height: feathersStore.isTablet ? 82 : 48,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      backgroundColor: Colors.greenButton,
      marginLeft: feathersStore.isTablet ? 8 : 4,
      marginVertical: feathersStore.isTablet ? 8 : 4,
      paddingLeft: feathersStore.isTablet ? 12 : 8,
      paddingTop: feathersStore.isTablet ? 4 : 2 
    },
    paginationButton: {
      width: "44%",
      height: feathersStore.isTablet ? 82 : 48,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      backgroundColor: Colors.itemBkgr,
      marginLeft: feathersStore.isTablet ? 8 : 4,
      marginVertical: feathersStore.isTablet ? 8 : 4,
      paddingLeft: feathersStore.isTablet ? 12 : 8,
      paddingTop: feathersStore.isTablet ? 4 : 2,
      borderWidth: 1,
      borderColor: Colors.symbolBlack
    },
    sectionButton:{
      width: "44%",
      height: feathersStore.isTablet ? 82 : 48,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginLeft: feathersStore.isTablet ? 8 : 4,
      marginVertical: feathersStore.isTablet ? 8 : 4,
      paddingLeft: feathersStore.isTablet ? 12 : 8,
      paddingTop: feathersStore.isTablet ? 4 : 2 
    },
    number: {
      fontWeight: "600",
      fontSize: feathersStore.isTablet ? 28 : 16,
      color: Colors.onAccentColor  
    },
    icon: {
      marginTop: 4,
      fontWeight: "600",
    },
    infoRow: {
      flexDirection: "row",
      width: "100%",
      height: feathersStore.isTablet ? 82 : 48,
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: Colors.itemBkgr,
      paddingHorizontal: 8 
    },
    priceCell: {
      fontWeight: "800",
      fontSize: feathersStore.isTablet ? 48 : 28,
      color: Colors.keyboardButton  
    },
    leftInfoRowSection: {
      flexDirection: "row",
      alignItems: "center",
    },
    invoiceTypeButton: {
      flexDirection: "row",
      width: feathersStore.isTablet ? 300 : 100,
      height: feathersStore.isTablet ? 58 : 38,
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 2,
      backgroundColor: Colors.itemBkgr,
      paddingHorizontal: 2 ,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: Colors.keyboardButton,
      marginLeft: 4,
    },
    invoiceTypeText: {
      fontWeight: "600",
      width: "70%",
      fontSize: feathersStore.isTablet ? 18 : 14,
      color: Colors.keyboardButton
    },
    shiftButton: {
      flexDirection: "row",
      width: feathersStore.isTablet ? 80 : 50,
      height: feathersStore.isTablet ? 58 : 38,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 2,
      backgroundColor: Colors.itemBkgr,
      paddingHorizontal: 2 ,
      borderWidth: 2,
      borderRadius: 4,
      borderColor: Colors.keyboardButton,
      marginLeft: feathersStore.isTablet ? 12 : 8,
    },
    clrText: {
      fontWeight: "800",
      fontSize: feathersStore.isTablet ? 24 : 18,
      color: Colors.keyboardButton, 
      marginLeft: feathersStore.isTablet ? 12 : 8,
    },
    buttonContainer:{
      position: "relative"
    },
    activityInd: {
      position : "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  return ( 
    <>
      <View style={styles.screenContainer}>
        {feathersStore?.newVersion && headerComponent()}
        {feathersStore?.demoMode && demoModeComponent()}
        <View style={styles.container}>
          <View style={styles.leftContainer}> 
            <ScrollView            
              contentContainerStyle={styles.productsList}
            >
              {feathersStore.isTablet ?  
                orderItems?.map(( item, index ) => renderProductListItemTablet(item, index)) 
                :
                orderItems?.map(( item, index ) => renderProductListItem(item, index))
              }
            </ScrollView>
          </View>
          <View style={styles.rightContainer}>
            <ScrollView            
              contentContainerStyle={styles.productsList}
            >   
            { feathersStore.isTablet ?    
              <>
              <FakeButtonTablet
                title={`${common.totalCap}: ${total.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet} 
              />
              <FakeButtonTablet
                title={`${common.remainderCap}: ${unpaid?.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet} 
              />          
              <FakeButtonTablet
                title={`${common.cashC}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet} 
                input={cashToPay}          
                textInput={true}
                editable={false}
              />         
              <FakeButtonTablet
                title={`${common.receivedC}`}
                titleColor={Colors.onPrimaryColor}
                color={enterPrice ? Colors.cashDisabled : Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet} 
                input={cash}
                textInput={true}
                editable={false} 
               
              />           
              <FakeButtonTablet
                title={`${common.cashChangeC}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet} 
                input={change}           
                textInput={true}
                editable={false}
              />     
              <ButtonTablet
                onPress={selectAll}           
                title={`${common.payAll}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.keyboardButton}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButtonTablet}  
              />    
              </>
              :
              <>   
              <FakeButton
                title={`${common.totalCap}: ${total.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
              />
              <FakeButton
                title={`${common.remainderCap}: ${unpaid?.toFixed(2) || 0}€`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
              />          
              <FakeButton
                title={`${common.cashC}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={cashToPay}          
                textInput={true}
                editable={false}
              />         
              <FakeButton
                title={`${common.receivedC}`}
                titleColor={Colors.onPrimaryColor}
                color={enterPrice ? Colors.cashDisabled : Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={cash}
                textInput={true}
                editable={false} 
               
              />           
              <FakeButton
                title={`${common.cashChangeC}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.primaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
                input={change}           
                textInput={true}
                editable={false}
              />     
              <Button
                onPress={selectAll}           
                title={`${common.payAll}`}
                titleColor={Colors.onPrimaryColor}
                color={Colors.keyboardButton}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}  
              />       
              </>
            }
            </ScrollView>
          </View>
       
        </View>      
         
            <>  
              <View style={styles.infoRow}>
                <View style={styles.leftInfoRowSection}>
                  <TouchableOpacity 
                    onPress={openInvoiceTypeModal} 
                    style={styles.invoiceTypeButton}
                  >
                    <Text style={styles.invoiceTypeText}>
                      {feathersStore?.isTablet ? findInvoiceType().invoiceTypeName : findInvoiceType().invoiceTypeNumber}
                    </Text>
                    <Icon name={chevronDownIcon} size={feathersStore?.isTablet ? 32 : 20} color={Colors.keyboardButton} />
                  </TouchableOpacity> 
                  <TouchableOpacity 
                    onPress={toggleEnterPrice} 
                    style={styles.shiftButton}
                  >
                    <Icon name={enterPrice ? upArrow : downArrow} size={32} color={Colors.keyboardButton} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={clrPressed} 
                  >
                    <Text style={styles.clrText}>CLR</Text>
                  </TouchableOpacity>
                </View>
                <View >
                  <Text style={styles.priceCell}>{`${price}€`}</Text>
                </View>
              </View>       
              <View style={styles.keyboardContainer}>      
              { feathersStore.isTablet ?  
                  <NumericKeyboardTablet 
                    onPress={setCharacterInput} 
                    pressBackspace={setBackspace}
                  /> 
                  :
                  <NumericKeyboard 
                    onPress={setCharacterInput} 
                    pressBackspace={setBackspace}
                  />
                } 
                <View style={styles.keyboardRight}>
                  {sectionsShowing?.map(( item, index ) =>
                    <TouchableOpacity 
                      key={index} 
                      disabled={+price === 0}
                      onPress={sectionBtnPressed(item)} 
                      style={[styles.keyboardButton, {backgroundColor: findColor(item.color)}]}>
                      <Text style={styles.number}>{item.name}</Text>
                    </TouchableOpacity>
                  )}            
                  <TouchableOpacity 
                    disabled={backIndex === 0}
                    onPress={backPressed} 
                    style={[styles.paginationButton, (backIndex === 0) && {borderColor: Colors.paginationDisabled}]}
                  >
                    <Text style={styles.icon}>
                      <Icon 
                        name={arrowBackCircle} 
                        size={feathersStore?.isTablet ? 32 : 22} 
                        color={backIndex > 0 ? Colors.symbolBlack : Colors.paginationDisabled} />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    disabled={forwardIndex === realm_sections.length - 1}
                    onPress={forwardPressed} 
                    style={[styles.paginationButton, (forwardIndex === realm_sections.length - 1) && {borderColor: Colors.paginationDisabled}]}
                  >
                    <Text style={styles.icon}>
                      <Icon 
                        name={arrowForwardCircle} 
                        size={feathersStore?.isTablet ? 32 : 22} 
                        color={forwardIndex < realm_sections.length - 1 ? Colors.symbolBlack : Colors.paginationDisabled} 
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={cashPayment} 
                    style={styles.greenButton}
                    disabled={!(cashToPay > 0) || feathersStore?.demoMode || cashPaying || visaPaying || nativePosPaying }
                  >
                    <Text style={styles.icon}>
                      <Icon name={checkIconCircle} size={feathersStore?.isTablet ? 32 : 22} color={Colors.onAccentColor} />
                    </Text>
                  </TouchableOpacity>                 
                  <TouchableOpacity 
                    onPress={payVisa} 
                    style={styles.greenButton}
                    disabled={!(cashToPay > 0) || feathersStore?.demoMode || cashPaying || visaPaying || nativePosPaying}
                  >
                    <Text style={styles.number}>VISA</Text>
                  </TouchableOpacity>  
                               
                </View>
              </View> 
            </>          
       
      </View>
      <CancelItemModal
        visible={cancelModalVisible}
        deleteButton={cancelItem}
        cancelButton={() => setCancelModalVisible(false)}
      /> 
      <InvoiceTypeModal
        title={common.invoiceTypeSelection}
        cancelButton={closeInvoiceTypeModal}        
        visible={invoiceTypeModal}
      />
      <InvoiceDataModal
        cancelButton={closeInvoiceDataModal}        
        visible={invoiceDataModal}
        issueReceipt={_issueReceipt}
      />
      <ErrorModal
        cancelButton={closeErrorModal}
        errorText={common.printerConnectionError}
        visible={errorModal}
        isTablet={feathersStore.isTablet}
      />  
      <ActivityIndicatorModal
        message={common.wait}
        onRequestClose={closeIssuingReceiptModal}
        title={common.waitPrint}
        visible={issuingReceipt}
        isTablet={feathersStore.isTablet}
      />   
      <InfoModal
        message={myPosErrorMessage}
        iconName={"alert"}
        iconColor={Colors.primaryColorLight}
        title={common.failedTransaction}
        buttonTitle={common.exit}
        onButtonPress= {closeMyPosErrorModal}
        visible = {myPosError}
      /> 
      <PayingModal
        checkButton={checkStatus}
        deleteButton={deletePaymentSession}  
        visible = {visaPaying}
        checking={checkingVisa}
      />
    </>
  );
          
}



export default inject('feathersStore')(observer(HomeScreen));
