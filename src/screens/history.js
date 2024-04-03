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


  useEffect(() => {
    setInvoiceTypes(AppSchema.invoiceTypes);
    setFrom(DateTime.now().startOf("month").toISODate());
    setTo(DateTime.now().toISODate());
  }, []);

  useEffect(() => {
    const filtered = realm_receipts.filtered('receiptKind TEXT $0 && createdAt > $1 && createdAt < $2'
    , invoiceType, toTimeStamp(from), toTimeStamp(to));
    setFilteredReceipts(filtered);
  }, [from, to, invoiceType])

  const printThermal = req => async() =>{
    await printLocally(req)
  }

  const createPDF = () => item => async() => {

  }

  const issueDebit = () => item => async() => {

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
      if(ex.code === "ECONNREFUSED"){ //After restart printer gets stuck and needs retries   
        console.log('Restart'); 
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
          title={common.waitStorage}
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
    flex:1,  
    justifyContent: "space-between",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2  
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