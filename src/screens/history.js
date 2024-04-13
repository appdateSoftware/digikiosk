/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image
} from "react-native";
import Divider from "../components/Divider";
import {
  Caption,
  Subtitle1,
  Subtitle2
} from "../components/text/CustomText";
import TouchableItem from "../components/TouchableItem";
import ActivityIndicatorModal from "../components/modals/ActivityIndicatorModal";
import DeleteModal from "../components/modals/DeleteModal";
import {useRealm, useQuery } from '@realm/react';
import { AppSchema } from "../services/receipt-service";
import Icon from "../components/Icon";
import { DateTime } from "luxon";
import {Picker} from '@react-native-picker/picker';
import LinkButton from "../components/buttons/LinkButton";
import CalendarModal from "../components/modals/CalendarModal";
import Text from '../components/Text';
import Card from '../components/buttons/Card';
import {shadowDefault} from '../utils/shadow';
import TcpSocket from 'react-native-tcp-socket';
import {EscPos} from '@tillpos/xml-escpos-helper';
import ErrorModal from "../components/modals/ErrorModal";

import Colors from "../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../hooks/_useTranslate';

// DeliverySectionA Config
const printIcon = "print-outline";
const trashIcon = "trash-outline";


// DeliverySectionA Component
const Receipt = ({  
  deleteSection, 
  receiptKind,
  numericId,
  receiptDate,
  receiptTime,
  totalCaption,
  receiptTotal,
  paymentMethod,
  companyName,
  printThermal,
  issueDebit,  
}) => (
  
    <View style={[styles.receiptCard]}>
      <View style={styles.leftAddresContainer}>       
        <View style={styles.sectionInfo}>         
          <Subtitle1 style={styles.sectionText}>
            {`${receiptKind} ${numericId}  ${totalCaption}: ${receiptTotal}€`}
          </Subtitle1>
          <Subtitle2>{`${receiptDate} ${receiptTime} ${paymentMethod}`}</Subtitle2>
          {companyName?.length > 0 && <Subtitle2>{`${companyName}`}</Subtitle2>}
        </View>
      </View>

      <View style={styles.buttonsContainer}> 
        <TouchableItem style={styles.end} borderless  onPress={printThermal}>
          <View style={styles.iconContainer}>
            <Icon name={printIcon} size={21} color={Colors.secondaryText}/>                       
          </View>
        </TouchableItem>          
     
        <TouchableItem style={styles.end} borderless  onPress={deleteSection}>
          <View style={styles.iconContainer}>
            <Icon name={trashIcon} size={21} color={Colors.secondaryColor}/>                       
          </View>
        </TouchableItem> 
         
      </View>
    </View>

);

// DeliverySectionA
const HistoryScreen =({feathersStore}) => {

  const realm = useRealm();
  const realm_receipts = useQuery('Receipt');
  const realm_company = useQuery("Company");
  const realm_unprinted = useQuery('Unprinted');
  const realm_counter = useQuery("Counter");

  let common = _useTranslate(feathersStore.language);

  const [indicatorModal, setIndicatorModal] = useState(false) ;
  const [deleteModal, setDeleteModal] = useState(false) ;
  const [itemToDelete, setItemToDelete] = useState(null) ;
  const [from, setFrom] = useState(null) ;
  const [to, setTo] = useState(null) ;
  const [invoiceType, setInvoiceType] = useState("alp");
  const [invoiceTypes, setInvoiceTypes] = useState([]);
  const [showFromModal, setShowFromModal] = useState(false) ;
  const [showToModal, setShowToModal] = useState(false) ;
  const [filteredReceipts, setFilteredReceipts] = useState([]) ;
  const [errorModal, setErrorModal] = useState(false) ;   
  const [issuingReceipt, setIssuingReceipt] = useState(false) ;  

  useEffect(() => {
    setInvoiceTypes(AppSchema.invoiceTypes);
    setFrom(DateTime.now().startOf("month").toISODate());
    setTo(DateTime.now().toISODate());
  }, []);

  useEffect(() => {
    const filtered = realm_receipts.filtered('receiptKind TEXT $0 && createdAt > $1 && createdAt < $2'
    , invoiceType, toTimeStamp(from), toTimeStamp(to)).sorted("createdAt",true);
    setFilteredReceipts(filtered);
  }, [from, to, invoiceType])

  const printThermal = req => async() =>{
    setIndicatorModal(true);   
    await printLocally(req)
  }

  const createPDF = () => item => async() => {

  }

  const issueDebit = () => item => async() => {
    const oldReceipt = {
      receiptKind : item.receiptKind,
      receiptItems: item.receiptItems,
      receiptTotal: item.receiptTotal,
      totalNetPrice: item.totalNetPrice,
      vatAnalysis: item.vatAnalysis,
      paymentMethod: item.paymentMethod,
      companyData: item?.companyData
    };
    if(["tpy", "tda", "pt"].includes(item.receiptKind)){

    }

  } 

  const openDeleteModal = item => () => {
    setItemToDelete(item);
    setDeleteModal(true);
  } 
    
  const keyExtractor = (item, index) => index.toString();

  const renderReceiptItem = ({ item, index }) => (
    <Receipt
      key={item._id}
      deleteSection={openDeleteModal(item)}     
      receiptKind={findInvoiceType(item?.receiptKind) || ""}
      numericId={item.numericId?.split("_")[1]}
      receiptDate={item.receiptDate}
      receiptTime={item.receiptTime}
      totalCaption={common.total}
      receiptTotal={item.receiptTotal}
      paymentMethod={item.paymentMethod}
      companyName={item?.companyData?.legalName || ""} 
      printThermal={printThermal(item.req)}
      issueDebit={issueDebit(item)}          
      itemIndex={index}
    />
  );

  const renderSeparator = () => <Divider />;

  const findVat = (id) => {
    return AppSchema.vatsArray.find(vat => +vat.id === +id)?.label || ""
  } 
 
  const closeIndicatorModal = () => {    
    setIndicatorModal(false); 
  }; 

  const closeDeleteModal = () => {    
    setDeleteModal(false); 
  };

  const closeErrorModal = () => {    
    setErrorModal(false); 
  };

  const invoiceTypeChange = p => {    
    setInvoiceType(p);
  };

  const findInvoiceType = () => {
    return AppSchema.invoiceTypes.find(it => it.name === feathersStore.invoiceType)?.invoiceTypeNumber || ""
  }

  const toGreekLocale = date => { //--> Calendar operates internally with dates of the format: 2024-03-12
    if(date){
      dateArray = date.split('-');
      return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    }else return "";  
  }

  const toTimeStamp = isoDate => {
    return DateTime.fromISO(isoDate).endOf('day').toMillis();
  }

  const printLocally = (req) => {

  const make = "zywell";
  const ip = realm_company[0].printerIp;   
  console.log( realm_company[0].printerIp)
 
  const options = {
    port: 9100,   //connect to
    host: ip,   //connect to
    reuseAddress: true,   
  }

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
 
    device.on("close", () => {
      if(device) {
        device.destroy();
        device = null;
      }
      resolve(true);
      return;
    });

    device.on("error", async(error) => {
      console.log(`Network error occured. `, error);
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
  //    reject(true);
      setIndicatorModal(false);
      setErrorModal(true);
    });   
  });    
}; 

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

const issueReceipt = async(oldReceipt) => { 
  const paymentMethod = oldReceipt.paymentMethod;
  const companyData = oldReceipt.companyData;
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
  let totalNetPrice = oldReceipt.totalNetPrice;   
  let unReceiptedItems =  oldReceipt.receiptItems; 

  let vatAnalysisHeader = 
    '<align mode="left">' +    
    '<text-line>Ανάλυση ΦΠΑ</text-line>' + 
    `<text-line>Συντελεστής` + 
    '<x-position>245</x-position><text>ΦΠΑ%</text>' +
    '<x-position>350</x-position><text>Αξία ΦΠΑ</text>' +
    '<x-position>455</x-position><text>Καθ. Αξία</text-line>' +
    '</align>';          
    
  for (let item of unReceiptedItems){
    itemsList = itemsList + 
      '<align mode="left">' +
        `<text-line>${item.name}` + 
        `<x-position>245</x-position><text>${item.vatLabel}</text>` +
        `<x-position>350</x-position><text>${parse_fix(item.underlyingValue)}</text>` +
        `<x-position>455</x-position><text>${parse_fix(item.product_totalPrice)}<set-symbol-cp>€</set-symbol-cp></text-line>` +
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
        `<x-position>245</x-position><text>${getVat(vat.id)}</text>` +
        `<x-position>350</x-position><text>${parse_fix(receipt[`vat${vat.id}`].vatAmount)}</text>` +
        `<x-position>455</x-position><text>${parse_fix(receipt[`vat${vat.id}`].underlyingValue)}</text-line>` +
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
    openMyDataErrorAlert();
    setIssuingReceipt(false);
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
      `<text-line>----------------------------------------------</text-line>` +                
      '</align>' +
      '<align mode="left">' +
      `<text-line>Στοιχεία πελάτη: ${companyData.legalName}</text-line>` +
      `<text-line>ΑΦΜ: ${companyData.afm} ΔΟΥ: ${companyData.doyDescription}</text-line>` +
      '</align>'
    : "")  +
    '<align mode="center">' +
    `<text-line>----------------------------------------------</text-line>` +    
    '</align>' +            
        itemsList + 
    '<line-feed />' +         
    '<align mode="center">' +
    `<text-line>----------------------------------------------</text-line>` +
    '</align>' +
      vatAnalysisHeader +
      vatAnalysis +
    '<align mode="left">' +
    `<text-line>Σύνολο:` + 
    `<x-position>350</x-position><text>${parse_fix(receiptTotal - receipt.totalNetPrice)}</text>` +
    `<x-position>455</x-position><text>${parse_fix(receipt.totalNetPrice)}</text-line>` +
    '</align>' +   
    '<align mode="center">' +
    `<text-line>----------------------------------------------</text-line>` +
    '</align>' +
    '<align mode="left">' +
    `<text-line>${paymentMethod === "VISA" ? "ΚΑΡΤΑ" : "ΜΕΤΡΗΤΑ"}` + 
    `<x-position>455</x-position><text>${parse_fix(paymentMethod === "VISA" ? receiptTotal : cash)}</text-line>` +
    '</align>' +
    '<align mode="center">' +
    `<text-line>----------------------------------------------</text-line>` +
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
  
  await printLocally(req);
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

const _findInvoiceType = (invoiceType) => {
  return AppSchema.invoiceTypes.find(it => it.name === invoiceType)
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


  return ( 
      <SafeAreaView style={styles.screenContainer}>
        
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />   
        <View style={styles.header}>
          <View style={[styles.headerSection, styles.invoiceType]}>
            <Picker
                style={[ styles.picker]}
                selectedValue={invoiceType}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                invoiceTypeChange(itemValue)
              }
            >
              {invoiceTypes?.map((i, index)=> (              
                <Picker.Item key={index}  color={Colors.primaryText} label={i.invoiceTypeNumber} value={i.name}/>
              ))}        
            </Picker>
          </View>
          <View style={styles.headerSection}>
            <LinkButton
              onPress={() => setShowFromModal(true)} 
              title={toGreekLocale(from)}         
            />
          </View>
          <View style={styles.headerSection}>
          <LinkButton
              onPress={() => setShowToModal(true)} 
              title={toGreekLocale(to)}         
            />
          </View>
        </View> 
        {filteredReceipts?.length > 0 ?
          <View style={styles.container}>
            <FlatList
              data={filteredReceipts}
              keyExtractor={keyExtractor}
              renderItem={renderReceiptItem}
              ItemSeparatorComponent={renderSeparator}
              contentContainerStyle={styles.receiptList}
            />           
          </View> 
          :
          <View style={styles.viewEmpty}>
            <Card style={styles.cardEmpty}>
              {require('../assets/img/empty.png') && <Image source={require('../assets/img/empty.png')} />}
              <Text third medium h3 h3Style={styles.textEmpty}>
                {common.textEmpty}
              </Text>
            </Card>
          </View>
        }   
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeIndicatorModal}
          title={common.waitPrint}
          visible={indicatorModal}
        />            
        <DeleteModal
          titleText={common.debitQuestion}
          cancelText={common.cancel}
          deleteText={common.issueDebit}
          cancelButton={closeDeleteModal}
          deleteButton={issueDebit}
          visible={deleteModal}
        />     
        <CalendarModal
          title={common.fromDate}
          cancelButton={() => setShowFromModal(false)}
          setFrom={setFrom}
          visible={showFromModal}
          buttonTitle={common.exit}
          markedDates={{
            [from]: {selected: true, disableTouchEvent: true}
          }}
        />   
        <CalendarModal
          title={common.toDate}
          cancelButton={() => setShowToModal(false)}
          setFrom={setTo}
          visible={showToModal}
          buttonTitle={common.exit}
          markedDates={{
            [to]: {selected: true, disableTouchEvent: true}
          }}
        /> 
         <ErrorModal
          cancelButton={closeErrorModal}
          errorText={common.printerConnectionError}
          visible={errorModal}
        />   
      </SafeAreaView>
    );
  }


const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background
  },
  container: {
    padding: 12
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    elevation: 1,
    margin: 2
  },
  headerSection: {
    flexDirection: "row",
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceType:{
    justifyContent: "flex-start"
  },
  picker: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  receiptList: {
    paddingVertical: 8
  },
  receiptCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.discount
  },
  active: {
    backgroundColor: "#f7f7f7"
  },
  leftAddresContainer: {
    flex: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  sectionInfo: { flex: 1, marginRight: 4 },
  caption: {
    paddingVertical: 2,
    color: Colors.accentColor
  },
 
  sectionText: { paddingVertical: 4 },
  buttonsContainer: { 
    flex:2,  
    flexDirection: "row",
    justifyContent: "space-between"
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  end: {
    flex: 1,
    alignSelf: "flex-end"  
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
});

export default inject('feathersStore')(observer(HistoryScreen));