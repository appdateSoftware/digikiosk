import React from 'react';
import { Realm } from '@realm/react';
import Colors from "../theme/colors";
export class AppSchema extends Realm.Object {

  _id;
  receipt;
  createdAt;

  static persistedCollections = ["Receipt", "Language", , "Counter", "Section", "Company", "User"];

  static rolesArray = [{
    "id" : 1,
    "label" : "Ταμείας 1",
    "role": "cashier"
  }, {
    "id" : 2,
    "label" : "Ταμείας 2",
    "role": "cashier"
  }, {
    "id" : 3,
    "label" : "Ταμείας 3",
    "role": "cashier"
  }, {
    "id" : 4,
    "label" : "Ταμείας 4",
    "role": "cashier"
  }, {
    "id" : 5,
    "label" : "Ταμείας 5",
    "role": "cashier"
  }, {
    "id" : 6,
    "label" : "Διαχειριστής",
    "role": "admin"
  }];

  static vatsArray = [{
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

  static colorsArray = [{
    "id" : "blue",
    "value" : "rgb(35, 87, 188)"
  },{
    "id" : "red",
    "value" : "rgb(213, 33, 39)"
  },{
    "id" : "violet",
    "value" : "rgb(115, 59, 151)"
  }, {
    "id" : "orange",
    "value" : "rgb(246, 133, 30)"
  }, {
    "id" : "purple",
    "value" : "rgb(70, 19, 155)"
  }, {
    "id" : "bordeaux",
    "value" : "rgb(127, 23, 52)"
  }, {
    "id" : "brown",
    "value" : "rgb(99, 49, 0)"
  }, {
    "id" : "black",
    "value" : Colors.black
  }];

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
      invoiceTypeName: "'ΠΙΣΤΩΤΙΚΟ ΣΤΟΙΧΕΙΟ ΛΙΑΝΙΚΗΣ'",
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
      receiptKind: {type: 'string', indexed: 'full-text'},
      numericId: {type: 'string'},    
      issuer:  {type: 'string'},
      receiptTotal: {type: 'mixed'},  
      receiptDate:  {type: 'string'},
      receiptTime:  {type: 'string'},  
      createdAt: {type: 'int'},
      receiptItems: {type:'string'},    
      paymentMethod:  {type: 'string'},
      cash: {type: 'string', default: "0"},  
      change: {type: 'string', default: "0"},
      totalNetPrice: {type: 'mixed'},  
      vatAnalysis: {type:'string' },
      req: {type: 'string'},
      footer:  {type: 'string'},
      companyData: {type: "mixed"}     
    }
  }; 
  
  static ProductSchema = {   
    name: 'Product',      
    properties: {   
      'name': {type: 'string', default: 'ΔΙΑΦΟΡΑ 24%'},    
      'nameEnglish': {type: 'string', default: 'VARIOUS 24%'}, 
      'product_totalPrice': {type: 'mixed'},    
      'color': {type: 'string', default: 'blue'},  
      'vatId': {type: 'mixed', default: '1'},  
      'vatLabel': {type: 'string'}, 
      'vatAmount': {type: 'mixed'},
      'underlyingValue': {type: 'mixed'}, 
    }
  };

  static LanguageSchema = {
    name: 'Language',      
    properties: {
      name: {type: 'string', default: 'el'},       
    }
  };

  static DemoSchema = {
    name: 'Demo',      
    properties: {
      val: {type: 'bool', default: 'true'},       
    }
  };

  static InvoiceTypeSchema = {
    name: 'InvoiceType',      
    properties: {
      name: {type: 'string', default: 'el'},       
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
      vatAmount: {type: 'mixed'},
      underlyingValue: {type: 'mixed'},      
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

  static SectionSchema = {
    primaryKey: 'name',
    name: 'Section',      
    properties: {
      'name': {type: 'string', default: 'ΔΙΑΦΟΡΑ 24%'},  
      'nameEnglish': {type: 'string', default: 'VARIOUS 24%'},  
      'color': {type: 'string', default: 'blue'},  
      'vat': {type: 'int', default: 1}
    }
  }; 

  static UnprintedSchema = {
    name: 'Unprinted',      
    properties: {
      req: {type: 'string'},       
    }
  }; 
};
