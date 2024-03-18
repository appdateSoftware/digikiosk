import React from 'react';
import { Realm } from '@realm/react';
export class Receipt extends Realm.Object {

  _id;
  receipt;
  createdAt;

  static generate(receipt) {
    return {
      _id: new Realm.BSON.ObjectId(),
      displayreceipt: receipt?.displayreceipt || "",
      createdAt: new Date().getTime(),
      orderId: receipt.orderId,
      customerName: receipt.customerName,
      deliveryAddress: receipt.deliveryAddress,
      isRead: false,
      type: receipt?.deliveryStatus || 'Pending'  
    };
  }

  static schema = {
    name: 'Notification',
    primaryKey: '_id',
    properties: {
      _id: {type: 'objectId', indexed: true},
      displayreceipt: 'string?',
      type: 'string?',
      orderId: 'string?',
      customerName: 'string?',
      deliveryAddress: 'string?',
      createdAt: 'int',
      isRead: 'bool?'
    }
  };
  
};
