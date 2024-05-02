import React, { useState, useCallback, useLayoutEffect } from "react";
import {useRealm, useQuery} from '@realm/react';
import BleManager from 'react-native-ble-manager';
import { 
  NativeModules,
  NativeEventEmitter  
} from 'react-native';
import { inject, observer } from "mobx-react";
import {EscPos} from '@tillpos/xml-escpos-helper';
import feathersStore from "../feathersStore";

const BLE_NAME ="Printer001"
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const PrintService =({navigation, feathersStore}) => {

}

export default inject('feathersStore')(observer(PrintService));

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

export const writeToBLE = async(req) => {
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

      "DC:0D:30:63:D9:B6",
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

export const connectToPrinter = async(id) => {   
  try{
    const resp = await BleManager.connect(id);
    feathersStore.setBleDisconnected(false);
    retrieveServices(id);
  }catch(err){
    feathersStore.setBleDisconnected(true);
    console.log("failed connecting to the device", err)
    throw(err)
  }  
}

const retrieveServices = async(id) => { 
  try{
    peripheralInfo = await BleManager.retrieveServices(id)
      // Success code 
      console.log("Peripheral info:", peripheralInfo);
    
  }catch(error){
    console.error("retrieveServices: ",error);
    throw(err);
  };
}
/*
var Store = inject('feathersStore')(observer((props) => {
  console.log("Props:", props)
}));
*/
export const handleGetConnectedDevices = async() => {
  try{
     const results = await BleManager.getBondedPeripherals([])
    if (results.length === 0) {
      console.log('No connected bluetooth devices');
    } else {
      for (let i = 0; i < results.length; i++) {     
        console.log(results[i]);
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






