import React from 'react';
import { Realm } from '@realm/react';
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
    primaryKey: 'id',
    properties: {
      id: {type: 'int', indexed: true},
      company: {type:'object', objectType: 'Company'},
      issuer: {type:'object', objectType:  'User'},
      products: {type:'list', objectType:  'Product'},
      receiptKind: {type: 'string'},
      receiptDate:  {type: 'string'},
      receiptTime:  {type: 'string'},
      createdAt: {type: 'int'},
      paymentMethod:  {type: 'string'},
      paymentAmount: {type: 'double'},  
      receiptTotal: {type: 'double'},  
      netTotal: {type: 'double'},  
      vatTotal: {type: 'double'},  
      vatAnalysis: {type:'list', objectType: 'Vat' },
      mark:  {type: 'string'},
      uid:  {type: 'string'},
      auth:  {type: 'string'},
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
    primaryKey: 'id',      
    properties: {
      id: {type: 'int'},  
      label: {type: 'int'},  
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
      'role': {type: 'string', default: 'el'},   
    }
  };

  static CompanySchema = {   
    name: 'Company',      
    properties: {
      'name': {type: 'string'},  
      'nameEnglish': {type: 'string'}, 
      'legalName': {type: 'string'},        
      'afm': {type: 'string'},  
      'token': {type: 'string'},  
      'doy': {type: 'string'},
      'address': {type: 'string'},
      'phone': {type: 'string', optional: true},
      'ypahes': {type: 'string', default: 'https://simply.gr'},  
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
      'section': {type:'object', objectType:  'Section'},     
      'product_totalPrice': {type: 'double'},  
      'vatAmount': {type: 'double'},
      'underlyingValue': {type: 'double'}, 
    }
  };
  
};
