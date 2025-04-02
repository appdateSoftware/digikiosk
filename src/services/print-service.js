import React, { useState, useCallback, useLayoutEffect } from "react";
import BleManager from 'react-native-ble-manager';
import { 
  NativeModules,
  NativeEventEmitter  
} from 'react-native';
import { inject, observer } from "mobx-react";
import {EscPos} from '@tillpos/xml-escpos-helper';
import feathersStore from "../feathersStore";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from 'uuid';

const BLE_NAME ="Printer001"
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const readFromBLE = async() => {
  try{
    const data = await BleManager.read(
      "DC:0D:30:63:D9:B6",
    //  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
    //  "18f0",
      "1800",
    //  "49535343-8841-43f4-a8d4-ecbe34729bb3",
    //  "2af1",
      "2a00",    
    );
    console.log("Read: ", data);
  }catch(error){
    // Failure code
    console.log(error);
  };

}   

export const writeToBLE = async(req, printerIp) => {
  const make = "zywellBLE";
  
  //TEST
  const _req =`
    <?xml version="1.0" encoding="UTF-8"?>
    <document>
    <set-cp/>
      <align mode="center">
        <bold>
          <text-line size="1:0">TEST 2 <set-symbol-cp>€</set-symbol-cp></text-line>
        </bold>
      </align>
      <align mode="left">
        <text-line size="0:0">\u03b1 DUCEROAD duceroad<set-symbol-cp>\u2021</set-symbol-cp></text-line>  
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
  const buffer = EscPos.getBufferFromXML(req, make);
  try{
  //    BleManager.writeWithoutResponse(
    await BleManager.write(

     // "DC:0D:30:63:D9:B6",
     `${printerIp.trim()}`,
    //  "49535343-fe7d-4ae5-8fa9-9fafd205e455",
    //  "18f0",
      "e7810a71-73ae-499d-8c15-faa9aef0c3f2",
    //  "49535343-8841-43f4-a8d4-ecbe34729bb3",
    //  "2af1",
      "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f",
      // encode & extract raw `number[]`.
      // Each number should be in the 0-255 range as it is converted from a valid byte.
      buffer.toJSON().data
    )
  }catch(error){
    // Failure code
    console.log(error);
    throw (error)
  };

}

const connectToPrinter = async(id) => {   
  try{
    const resp = await BleManager.connect(id);
    feathersStore.setBleDisconnected(false);    
    const peripheralInfo = await BleManager.retrieveServices(id);
    return peripheralInfo;
  }catch(err){
    feathersStore.setBleDisconnected(true);
    console.log("failed connecting to the device", err)
    throw(err)
  }  
}

export const handleGetConnectedDevices = async() => {
  try{
     const results = await BleManager.getBondedPeripherals([])
    if (results.length === 0) {
      console.log('No connected bluetooth devices');
      feathersStore.setBleDisconnected(true);
    } else {
      for (let i = 0; i < results.length; i++) {     
        if (results[i]?.name == BLE_NAME){
          feathersStore.setBleId(results[i].id);
          connectToPrinter(results[i].id);
        }
      }
    }
  }catch(error){
    console.error("No bonded devices: ",error);
    throw(err);
  }; 
};

export const sendPayment = async(uid, paymentAmounts, native = false) => {
  const timeStamp = DateTime.now().toFormat('yyyyMMddHHmmss');
  const UIDcreationdate = DateTime.now().toFormat('yyyy-MM-dd');
  const terminal = feathersStore.loggedInUser.terminal;   

  const payment = {
    UIDIssuervatnumber: feathersStore.loggedInUser.afm, //Company vatNumber
    UIDcreationdate,      // "2024-06-11",
    UIDbranchid: "0", //Company branchNumber
    "UIDinvoicetype": "",
    "UIDinvoiceseries": "", //INVOICETYPE SERIES
    UIDinvoicenumber: "", //INVOICETYPE NEXTNUMBconstER
    uid,        //: "123456789012345678111", // not required if the above UID fields are supplied
    mark: "", //optional
    timeStamp,    //"20240916120000" required //greek local time in YYYYMMDDhhmmss
    "amount": Math.round(paymentAmounts.paidSum * 100),
    "netAmount": Math.round(paymentAmounts.netPaidSum * 100),
    "vatAmount": Math.round(paymentAmounts.vatPaidSum * 100),   
    "totalAmount": terminal.make === 'MYPOS' ? Math.round(paymentAmounts.paidSum * 100) : Math.round(paymentAmounts.vatPaidSum * 100),
    "terminalId": terminal.TID,
    paymentGateway:  terminal.make === 'MYPOS' ? "1" : "2",
    order: {
      tip: 0, 
      sourceCode: terminal.sourceCode,
      mellonApiKey: terminal?.mellonApiKey || null,
      terminalMerchantId: terminal.terminalMerchantId,
      native
    }
  }  

  console.log(payment)
 
  try{  

    const sessionId = uuidv4();
    const response = await feathersStore.postToMyDataPayment(payment, {sessionId}, terminal?.make || "");
    if(response && native)return response;
    if(response?.sessionId){
      return response
    }else{
      console.log(response);
      await logError(response, payment, "Pay.js", "398");
      return;
    }
  }catch(error){
    console.log(error);
    await logError(error, payment, "Pay.js", "398");
    return;
  }   
    
}

export const logError = async(error, persistedReceipt, file, line) => {
  const payload = {
    errorKind: "my_data",
    origin: "Android PDA",
    file: file,
    line: line,
    error,
    persistedReceipt
  }
  await feathersStore.createLogEntry(payload)
}

export const parse_fix = price => {
  return price ? parseFloat(price).toFixed(2) : 0;
} 


