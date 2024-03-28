import React from 'react';
import { Realm } from '@realm/react';
import TcpSocket from 'react-native-tcp-socket';
import {useRealm, useQuery} from '@realm/react';

export class AppSchema extends Realm.Object {

  _id;
  receipt;
  createdAt;

  static generateReceipt(receipt) {
    return {
    //  _id: new Realm.BSON.ObjectId(),
      displayReceipt: receipt?.displayreceipt || "",
      createdAt: new Date().getTime(),
      orderId: receipt.orderId,
      customerName: receipt.customerName,
      deliveryAddress: receipt.deliveryAddress,
      isRead: false,
      type: receipt?.deliveryStatus || 'Pending'  
    };
  }

  static ReceiptSchema = {
    name: 'Receipt',
    primaryKey: 'numericId',
    properties: {
      numericId: {type: 'int', indexed: true},
      receiptKind: {type: 'string'},
      issuer:  {type: 'string'},
      receiptTotal: {type: 'double'},  
      receiptDate:  {type: 'string'},
      receiptTime:  {type: 'string'},
      receiptItems: {type:'list', objectType:  'Product'},
      createdAt: {type: 'int'},
      paymentMethod:  {type: 'string'},
      cash: {type: 'double', default: 0},  
      change: {type: 'double', default: 0},
      totalNetPrice: {type: 'double'},  
      vatAnalysis: {type:'list', objectType: 'Vat' },
      req: {type: 'string'},
      footer:  {type: 'string'}      
    }
  };

  static LanguageSchema = {
    name: 'Language',      
    properties: {
      name: {type: 'string', default: 'el'},       
    }
  };

  static ActiveUserSchema = {
    name: 'ActiveUser',      
    properties: {
      user: {type:'object', objectType:  'User'},     
    }
  };

  static CounterSchema = {
    name: 'Counter',
    primaryKey: 'sequence_value',      
    properties: {
      sequence_value: {type: 'int', default: 0},       
    }
  };

  static VatSchema = {
    name: 'Vat',
    primaryKey: 'vatId',      
    properties: {
      vatId: {type: 'int'},  
      vatAmount: {type: 'double'},
      underlyingValue: {type: 'double'},      
    }
  };

  static UserSchema = {
    primaryKey: 'name',
    name: 'User',      
    properties: {
      'name': {type: 'string', default: 'ΤΑΜΕΙΑΣ 1'},  
      'nameEnglish': {type: 'string', default: 'CASHIER 1'},  
      'password': {type: 'string', default: '123'},  
      'role': {type: 'int'},   
    }
  };

  static CompanySchema = {   
    name: 'Company',      
    properties: { 
      'afm': {type: 'string'},  
      'name': {type: 'string'},  
      'nameEnglish': {type: 'string'}, 
      'legalName': {type: 'string'}, 
      'doyDescription': {type: 'string'},
      'legalDescription': {type: 'string'}, 
      'firmActDescription': {type: 'string'},      
      'companyOrigin': {type: 'int'},
      'postalAddress': {type: 'string'},   
      'postalAddressNo': {type: 'string'},
      'postalAreaDescription': {type: 'string'},        
      'postalZipCode': {type: 'string'}, 
      'companyPhone': {type: 'string'}, 
      'companyEmail': {type: 'string'}, 
      'vendor': {type: 'string'},     
      'printerIp':  {type: 'string'}
    }
  };

  static SectionsSchema = {
    primaryKey: 'name',
    name: 'Section',      
    properties: {
      'name': {type: 'string', default: 'ΔΙΑΦΟΡΑ 24%'},  
      'nameEnglish': {type: 'string', default: 'VARIOUS 24%'},  
      'color': {type: 'string', default: 'blue'},  
      'vat': {type: 'int', default: '1'}
    }
  };

  static ProductSchema = {   
    name: 'Product',      
    properties: {   
      'name': {type: 'string', default: 'ΔΙΑΦΟΡΑ 24%'}, 
      'product_totalPrice': {type: 'double'},
      'nameEnglish': {type: 'string', default: 'VARIOUS 24%'},  
      'color': {type: 'string', default: 'blue'},  
      'vatId': {type: 'int', default: '1'},  
      'vatLabel': {type: 'string'}, 
      'vatAmount': {type: 'double'},
      'underlyingValue': {type: 'double'}, 
    }
  };

  static UnprintedSchema = {
    name: 'Unprinted',      
    properties: {
      req: {type: 'string'},       
    }
  };

  static printLocally = (req) => {

    const realm = useRealm();
    const realm_unprinted = useQuery('Unprinted');
    const realm_company = useQuery('Company');
    const ip = realm_company[0].printerIp;   
   
    const options = {
      port: 9100,
      host: ip,
      localAddress: ip,
      reuseAddress: true,
      // localPort: 20000,
      // interface: "wifi",
    }
    const make = "zywell";
 
    return new Promise((resolve, reject) => {

      const buffer = EscPos.getBufferFromXML(req, make);

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

      device.on("close", () => {
        if(device) {
          device.destroy();
          device = null;
        }
        resolve(true);
        return;
      });

      device.on("error", async(ex) => {
        logger.info(`Network error occured. ${devid}`, ex.errno);
        if(ex.code === "ECONNREFUSED"){ //After restart printer gets stuck and needs retries   
          logger.info('Restart'); 
          device.destroy();
          device = null;
          await this.printLocally(req);   //TODO: Retry up to 10 times   
        }else if(ex.code === "ETIMEDOUT"){ //if printer is offline
          realm.write(()=>{     
            realm.create('Unprinted', req); 
          }) 
        }
        reject(true);
        return;
      });   
    });    
  };  
};
