import React from 'react';
import { Realm } from '@realm/react';
import TcpSocket from 'react-native-tcp-socket';
export class AppSchema extends Realm.Object {

  _id;
  receipt;
  createdAt;

  static invoiceTypes = [
    {
      id: "2.1",
      name: "tpy",
      invoiceTypeName: "ΤΙΜΟΛΟΓΙΟ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ",
      invoiceTypeNumber: "ΤΠΥ",
      invoiceTypeNumberName: "ΤΠΥ-Α"
    },
    {
      id: "1.1",
      name: "tda",
      invoiceTypeName: "ΤΙΜΟΛΟΓΙΟ ΔΕΛΤΙΟ ΑΠΟΣΤΟΛΗΣ",
      invoiceTypeNumber: "ΤΔΑ",
      invoiceTypeNumberName: "ΤΔΑ-Α"
    },
    {
      id: "11.1",
      name: "alp",
      invoiceTypeName: "ΑΠΟΔΕΙΞΗ ΛΙΑΝΙΚΗΣ ΠΩΛΗΣΗΣ",
      invoiceTypeNumber: "ΑΛΠ",
      invoiceTypeNumberName: "ΑΛΠ-Α"
    },
    {
      id: "11.2",
      name: "apy",
      invoiceTypeName: "ΑΠΟΔΕΙΞΗ ΠΑΡΟΧΗΣ ΥΠΗΡΕΣΙΩΝ",
      invoiceTypeNumber: "ΑΠΥ",
      invoiceTypeNumberName: "ΑΠΥ-Α"
    },
    {
      id: "11.4",
      name: "psl",
      invoiceTypeName: "ΠΙΣΤΩΤΙΚΟ ΣΤΟΙΧΕΙΟ ΛΙΑΝΙΚΗΣ",
      invoiceTypeNumber: "ΠΣΛ",
      invoiceTypeNumberName: "ΠΣΛ-Α"
    },
    {
      id: "5.2",
      name: "pt",
      invoiceTypeName: "ΠΙΣΤΩΤΙΚΟ ΤΙΜΟΛΟΓΙΟ / ΜΗ ΣΥΣΧΕΤΙΖΟΜΕΝΟ",
      invoiceTypeNumber: "ΠΤ",
      invoiceTypeNumberName: "ΠΤ-Α"
    }
  ];

  static origins = [{
    "id" : 1,
    "label" : "Αττική",
    "labelEnglish" : "Attica"
  }, {
    "id" : 2,
    "label" : "Ανατολική Μακεδονία και Θράκη",
    "labelEnglish" : "East Macedonia"
  }, {
    "id" : 3,
    "label" : "Κεντρική Μακεδονία",
    "labelEnglish" : "Central Macedonia"
  }, {
    "id" : 4,
    "label" : "Δυτική Μακεδονία",
    "labelEnglish" : "West Macedonia"
  }, {
    "id" : 5,
    "label" : "Ήπειρος",
    "labelEnglish" : "Epirus"
  }, {
    "id" : 6,
    "label" : "Θεσσαλία",
    "labelEnglish" : "Thessaly"
  }, {
    "id" : 7,
    "label" : "Ιόνια νησιά",
    "labelEnglish" : "Ionian Islands"
  }, {
    "id" : 8,
    "label" : "Δυτική Ελλάδα",
    "labelEnglish" : "West Greece"
  }, {
    "id" : 9,
    "label" : "Κεντρική Ελλάδα",
    "labelEnglish" : "Central Greece"
  }, {
    "id" : 10,
    "label" : "Πελοπόνησος",
    "labelEnglish" : "Peloponese"
  }, {
    "id" : 11,
    "label" : "Βόρειο Αιγαίο",
    "labelEnglish" : "North Aegean"
  }]

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
      footer:  {type: 'string'},
      invoiceData: {type: "mixed"}     
    }
  };

  static LanguageSchema = {
    name: 'Language',      
    properties: {
      name: {type: 'string', default: 'el'},       
    }
  };

  static InvoiceTypeSchema = {
    name: 'InvoiceType',      
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
    properties: {  
      tpy: {type: 'int', default: 0},     
      tda: {type: 'int', default: 0},  
      alp: {type: 'int', default: 0},  
      apy: {type: 'int', default: 0},    
      psl: {type: 'int', default: 0},  
      pt: {type: 'int', default: 0},  
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
      'active': {type: 'bool', default: 'false'}
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
};
