/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import {
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
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
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { DateTime } from "luxon";
import {Picker} from '@react-native-picker/picker';


import Colors from "../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../hooks/_useTranslate';

// DeliverySectionA Config
const saveIcon = "checkmark-outline";
const editIcon = "create-outline";
const trashIcon = "trash-outline";


// DeliverySectionA Component
const Receipt = ({  
  deleteSection, 
  name,
  colorCaption,
  color,
  colorValue,
  vatCaption,
  vat,
  printThermal,
  itemIndex
}) => (
  
    <View style={[styles.sectionCard, {borderColor: colorValue}]}>
      <View style={styles.leftAddresContainer}>       
        <View style={styles.sectionInfo}>         
          <Subtitle1 style={styles.sectionText}>
            {`${name}`}
          </Subtitle1>
          <Subtitle2>{colorCaption}: {`${color}`},  {vatCaption}: {`${vat}`}%</Subtitle2>
        </View>
      </View>

      <View style={styles.buttonsContainer}> 
        <TouchableItem style={styles.end} borderless  onPress={printThermal}>
          <View style={styles.iconContainer}>
            <Icon name={editIcon} size={21} color={Colors.secondaryText}/>                       
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

  let common = _useTranslate(feathersStore.language);

  const [indicatorModal, setIndicatorModal] = useState(false) ;
  const [deleteModal, setDeleteModal] = useState(false) ;
  const [itemToDelete, setItemToDelete] = useState(null) ;
  const [from, setFrom] = useState(null) ;
  const [to, setTo] = useState(null) ;
  const [invoiceType, setInvoiceType] = useState("alp");
  const [invoiceTypes, setInvoiceTypes] = useState([]);


  useEffect(() => {
    setInvoiceTypes(AppSchema.invoiceTypes);
    setFrom(DateTime.now().startOf("month").toISODate());
    setTo(DateTime.now().toISODate());
  }, []);

  useEffect(() => {

  }, [from, to, invoiceType])

  const printThermal = () => item => {

  }

  const createPDF = () => item => {

  }

  const issueCredit = () => item => {

  } 

  const openDeleteModal = item => () => {
    setItemToDelete(item);
    setDeleteModal(true);
  }

  const  deleteSection = async() => {
    setDeleteModal(false);   
    setIndicatorModal(true);        
    realm.write(()=>{ 
      realm.delete(itemToDelete)                        
    }); 
    setIndicatorModal(false); 
  };  
    
  const keyExtractor = (item, index) => index.toString();

  const renderReceiptItem = ({ item, index }) => (
    <Receipt
      key={item._id}
      deleteSection={openDeleteModal(item)}     
      name={item?.name || ""}
      color={item?.color || ""}   
      colorValue={findColor(item?.color)} 
      colorCaption={common.color}   
      vatCaption={common.vat}
      vat={findVat(item?.vat)}  
      itemIndex={index}
    />
  );

  const renderSeparator = () => <Divider />;

  const findVat = (id) => {
    return AppSchema.vatsArray.find(vat => +vat.id === +id)?.label || ""
  }

  const findColor = (id) => {
    return AppSchema.colorsArray.find(color => color.id === id)?.value || ""
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
            <Calendar
              onDayPress={day => {
                setFrom(day.dateString);
              }}          
            />
          </View>
          <View style={styles.headerSection}>
          <Calendar
              onDayPress={day => {
                setTo(day.dateString);
              }}            
            />
          </View>
        </View>   
        <View style={styles.container}>
          <FlatList
            data={realm_receipts}
            keyExtractor={keyExtractor}
            renderItem={renderReceiptItem}
            ItemSeparatorComponent={renderSeparator}
            contentContainerStyle={styles.receiptList}
          />        
          
        </View> 
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeIndicatorModal}
          title={common.waitStorage}
          visible={indicatorModal}
        />            
        <DeleteModal
          cancelButton={closeDeleteModal}
          deleteButton={deleteSection}
          visible={deleteModal}
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
    flex: 1,
    padding: 12
  },
  header: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    elevation: 1,
    margin: 2
  },
  headerSection: {
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
  sectionCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,    
    borderWidth: 2
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
  radioIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    width: 24,
    height: 24
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
  },
  end: {
    flex: 1,
    alignSelf: "flex-end"  
  },
  vSpacer: {
    height: 25
  }, 
});

export default inject('feathersStore')(observer(HistoryScreen));