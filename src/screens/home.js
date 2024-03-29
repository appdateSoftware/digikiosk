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
import { AppSchema } from "../services/receipt-service";
import {pickLanguageWord} from '../utils/pickLanguageWord.js';


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
}];

const vatsArray = [{
  "id" : 1,
  "label" : 24
}, {
  "id" : 2,
  "label" : 13
}, {
  "id" : 3,
  "label" : 6
}, {
  "id" : 4,
  "label" : 17
}, {
  "id" : 5,
  "label" : 9
}, {
  "id" : 6,
  "label" : 4
}, {
  "id" : 7,
  "label" : 0
}];

const checkIcon = "checkmark";

const HomeScreen = ({navigation, route, feathersStore}) => { 

  const realm = useRealm();
  const realm_counter = useQuery("Counter");
  const realm_sections = useQuery('Section');
  const realm_company = useQuery("Company");

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
  const [loading, setLoading] = useState(true);

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
    setChange(parse_fix(cash - cashToPay).toString())
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
   
    if(enterPrice)setPrice(oldVal => {
      let priceString = oldVal + ch;
      if(+priceString >= 1){
        if(priceString[0] === "0")priceString = priceString.slice(1);       
      }
      return priceString;
    });else{  
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

  const pricePressed = () => {
    setEnterPrice(true)
  }

  const resetCashInputs = () => {
    setCashToPay("0");
    setChange("0");
    setCash("0");
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

  const getVat = id => {
    return vatsArray.find(v => +v.id === +id)?.label.toString().padStart(2, '0') + "%"
  }

  const calculateNetPrice = (item) => {
    const label = vatsArray.find(v => +v.id === +item.id)?.label;
    const underlyingValue =  Math.round((item.product_totalPrice / (1 + label / 100 ) + Number.EPSILON) * 1000) / 1000 ;
    const vatAmount = item.product_totalPrice - underlyingValue;
    return {underlyingValue: +underlyingValue.toFixed(2), vatAmount}; 
  }
  
  const setNumericId = () => {
    let numericId = 0;
    if(realm_counter?.length > 0){
      numericId = +realm_counter[0].sequence_value + 1;
      realm.write(()=>{     
        realm_counter[0].sequence_value = numericId;      
      })
    }else{    //init
      realm.write(()=>{     
        realm.create('Section', {sequence_value: 0});
      })
    }
  } 

  const calculateVats = items => {    
    let vatsObj = {}
    for(let vat of vatsArray){
      let vatAmount = items.filter(item => +item.vatId === +vat.id)
        .map(i => i.vatAmount)        
        .reduce((a,b) => (+a + +b), 0).toFixed(2);
      let underlyingValue = items.filter(item => +item.product_vat === +vat.id)
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

  const issueReceipt = (paymentMethod, invoiceData) => async() => { 
    setIssuingReceipt(true);
    const date = new Date(); 
    const day = date.getDate().toString().padStart(2, "0"); 
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(2, "0");
    const localDate = day + '/' + month + '/' + year;
    let itemsList =""; 
    let vatAnalysis ="";  
    let totalNetPrice = 0.0;   
    let unReceiptedItems =  orderItems.filter(i => i?.toBePaid); 

    let vatAnalysisHeader = 
      '<align mode="left">' +    
      '<text-line>Ανάλυση ΦΠΑ</text-line>' + 
      `<text-line>Συντελεστής` + 
      `<x-position>245</x-position><text>ΦΠΑ%</text>`
      `<x-position>350</x-position><text>Αξία ΦΠΑ</text>` +
      `<x-position>455</x-position><text>Καθαρή Αξία</text-line>` +
      '</align>';          
      
    for (let item of unReceiptedItems){
      itemsList = itemsList + 
        '<align mode="left">' +
          `<text-line>${item.name}` + 
          `<x-position>245</x-position><text>${item.vatLabel}</text>`
          `<x-position>350</x-position><text>${parse_fix(item.underlyingValue)}</text>` +
          `<x-position>455</x-position><text>${parse_fix(item.product_totalPrice)}<set-symbol-cp>€</set-symbol-cp></text-line>` +
        '</align>';          
    }
    
    const receiptTotal = parseFloat(cashToPay).toFixed(2);

    let receipt ={
      receiptKind: "2.1",
      numericId: setNumericId(),
      issuer: feathersStore.user.name,
      receiptTotal: parse_fix(receiptTotal),
      receiptDate: localDate,
      receiptTime: date.toLocaleTimeString(),     
      receiptItems: unReceiptedItems,
      paymentMethod,
      cash,
      change     
    };

    const calcVats  = calculateVats([...unReceiptedItems]);
    Object.assign(receipt,  {...calcVats}, {vatAnalysis: calcVats});
    const response = await constructMyData(receipt);

    //---> Rollback
    if(!response?.qrcode){
      realm.write(()=>{     
        realm_counter[0].sequence_value = receipt.numericId - 1;      
      });     
      openMyDataErrorAlert();
      return;
    }
    //------->

    for (let vat of vatsArray){
      if(receipt[`vat${vat.id}`]?.vatAmount > 0){
        vatAnalysis = vatAnalysis +
        '<align mode="left">' +
          `<text-line>Κατ. ΦΠΑ: ${vat.id}` + 
          `<x-position>245</x-position><text>${getVat(vat.id)}</text>`
          `<x-position>350</x-position><text>${parse_fix(receipt[`vat${vat.id}`].vatAmount)}</text>` +
          `<x-position>455</x-position><text>${parse_fix(receipt[`vat${vat.id}`].underlyingValue)}</text-line>` +
        '</align>'; 
        totalNetPrice = +totalNetPrice + +receipt[`vat${vat.id}`].underlyingValue;
      }
    }

    Object.assign(receipt,  {totalNetPrice})

    const req =  
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<document>' +
      '<set-cp/>' +
      '<align mode="center">' +
        constructCompanyTitleNonEpos() +             
      '<line-feed />' +
      '<bold>' +                             
        (invoiceData?.afm ? `<text-line>ΑΠΟΔΕΙΞΗ ΛΙΑΝΙΚΗΣ ΠΩΛΗΣΗΣ</text-line>` : `<text-line>ΤΙΜΟΛΟΓΙΟ ΠΩΛΗΣΗΣ</text-line>`) +              
        `<text-line>ΧΕΙΡΙΣΤΗΣ: ${feathersStore.user.name}</text-line>` +
      '</bold>' +
      '</align>' +
      '<line-feed />' +
      '<align mode="left">' +
      `<text-line>${localDate} ${date.toLocaleTimeString()}</text-line>` +
      `<text-line>ΑΡ. ΑΠΟΔΕΙΞΗΣ: ${receipt.numericId}</text-line>` +     
      '</align>' +
       (invoiceData?.afm ? 
        '<align mode="center">' +
        `<text-line>------------------------------------------</text-line>` +                
        '</align>' +
        '<align mode="left">' +
        `<text-line>Στοιχεία πελάτη: ${invoiceData.name}</text-line>` +
        `<text-line>ΑΦΜ: ${invoiceData.afm} ΔΟΥ: ${invoiceData.doy}</text-line>` +
        '</align>'
      : "")  +
      '<align mode="center">' +
      `<text-line>------------------------------------------</text-line>` +    
      '</align>' +            
          itemsList + 
      '<line-feed />' +         
      '<align mode="center">' +
      `<text-line>------------------------------------------</text-line>` +
      '</align>' +
        vatAnalysisHeader +
        vatAnalysis +
      '<align mode="left">' +
      `<text-line>Σύνολο:` + 
      `<x-position>350</x-position><text>${parse_fix(receiptTotal - receipt.totalNetPrice)}</text>` +
      `<x-position>455</x-position><text>${parse_fix(receipt.totalNetPrice)}</text-line>` +
      '</align>' +   
      '<align mode="center">' +
      `<text-line>------------------------------------------</text-line>` +
      '</align>' +
      '<align mode="left">' +
      `<text-line>${paymentMethod === "VISA" ? "ΚΑΡΤΑ" : "ΜΕΤΡΗΤΑ"}` + 
      `<x-position>455</x-position><text>${parse_fix(paymentMethod === "VISA" ? receiptTotal : cash)}</text-line>` +
      '</align>' +
      '<align mode="center">' +
      `<text-line>------------------------------------------</text-line>` +
      '</align>' +
      '<align mode="left">' +  
      `<text-line>Σύνολο:` + 
      `<x-position>455</x-position><text>${parse_fix(receiptTotal)}<set-symbol-cp>€</set-symbol-cp></text></text-line>` +  
      (paymentMethod === "CASH" ?
      `<text-line>Ρέστα:` + 
      `<x-position>455</x-position><text>${parse_fix(change)}<set-symbol-cp>€</set-symbol-cp></text></text-line>`
      : "") +  
      '<line-feed/>' +         
      '<line-feed/>' +    
      `<text-line>${response?.footer}</text-line>` +
      '<line-feed/>' +
      '</align>' +     
      '<align mode="center">' +   
        `<qrcode ecl="M" size="4">${response?.qrcode}</qrcode>` +        
      '<line-feed />' +  
      '</align>' +    
      '<line-feed />' +                     
      '<paper-cut />' +
    '</document>' ;
    
    await AppSchema.printLocally(paymentMethod);
    Object.assign(receipt, {footer: response.footer, req});
    realm.write(()=>{     
      realm.create('Receipt', receipt);
    });
    for(let listItem of orderItems)Object.assign(listItem, {paid: true})
    setIssuingReceipt(false);
  }

  const constructCompanyTitleNonEpos = () => {
    return(
      `<bold><text-line size="1:1">${realm_company.name}</text-line></bold>` +
      '<line-feed />' +
      `<bold><text-line>${realm_company?.legalName || realm_company.name}</text-line></bold>` +
      '<line-feed />' +
      '<bold>' +
        `<text-line>${realm_company.postalAddress} ${realm_company.postalAddressNo} ${realm_company.postalAreaDescription} ${realm_company.postalZipCode}</text-line>` + 
        `<text-line>ΑΦΜ: ${realm_company.afm} ΔΟΥ ${realm_company.doyDescription}</text-line>` +
        `<text-line>${realm_company.firmActDescription}</text-line>` +
        (realm_company.companyPhone ? `<text-line>ΤΗΛ: ${realm_company.companyPhone}</text-line>` : '') +
        (realm_company.companyEmail ? `<text-line>ΤΗΛ: ${realm_company.companyEmail}</text-line>` : '') +
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
        "VATPerc": vatsArray.find(v => +v.id === +item.product_vat)?.label,
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

  
    for(let vat of vatsArray){
      const label = vatsArray.find(v => +v.id === +vat.id)?.label
      if(persistedReceipt[`vat${vat.id}`] != 0){
        vatAnalysis.push({
          "Name": label + "%",
          "Percentage": +label,
          "VatAmount": +persistedReceipt[`vat${vat.id}`].vatAmount,
          "UnderlyingValue": +persistedReceipt[`vat${vat.id}`].underlyingValue
        })
      }      
    } 

    const totalNetAmount = receipt.totalNetPrice;

    const body = 
    {
      "ActionTypeId": 1,
      "InvoiceDate": isoDate,
      "InvoiceTypeCode": "11.1",
      "InvoiceTypeName": "ΑΠΟΔΕΙΞΗ ΛΙΑΝΙΚΗΣ ΠΩΛΗΣΗΣ",
      "InvoiceTypeSeries": `${persistedReceipt.numericId}`,
      "InvoiceTypeSeriesName": "",
      "InvoiceTypeNumber": "ΑΛΠ",
      "InvoiceTypeNumberName": "ΑΛΠ-Α",
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
      "Payment": 
    //    "TotalPieces": persistedReceipt.totalPieces,
        [
          {
            "PaymentMethodType": "ΜΕΤΡΗΤΟΙΣ",
            "PaymentMethodTypeCode": 3,
            "PaymentAmount": persistedReceipt.receiptTotal,
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
    
    try{
      const payload = {
        body,
        vendor_name: realm_company[0].vendor
      }
      const response = await feathersStore.postToMyData(payload);     
      if(response?.data){
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

 const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator animating size="small" />;
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
                onPress={pricePressed}
                titleColor={Colors.onTertiaryColor}
                color={Colors.black}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton} 
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
                color={Colors.black}
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
                onPress={issueReceipt("CASH")}           
                title={<Icon name={checkIcon} size={32} color={Colors.onSecondaryColor}></Icon>}
                titleColor={Colors.onSecondaryColor}
                color={Colors.secondaryColor}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}
                disabled={!(cashToPay > 0)}
                showActivityIndicator={issuingReceipt}
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
                onPress={issueReceipt("VISA")}           
                title={"VISA"}
                titleColor={Colors.onPrimaryColor}
                color={Colors.selectionNew}
                borderColor={Colors.onSurface}
                buttonStyle={styles.sideButton}  
                disabled={!(cashToPay > 0)}
                showActivityIndicator={issuingReceipt}
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
