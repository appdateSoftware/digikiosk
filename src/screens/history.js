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
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { DateTime } from "luxon";
import {Picker} from '@react-native-picker/picker';
import LinkButton from "../components/buttons/LinkButton";
import CalendarModal from "../components/modals/CalendarModal";
import Text from '../components/Text';
import Card from '../components/buttons/Card';
import {shadowDefault} from '../utils/shadow';


import Colors from "../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../hooks/_useTranslate';

// DeliverySectionA Config
const saveIcon = "checkmark-outline";
const printIcon = "print-outline";
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

  const issueDebit = () => item => {

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

  const toGreekLocale = date => { //--> Calendar operates internally with dates of the format: 2024-03-12
    if(date){
      dateArray = date.split('-');
      return dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0];
    }else return "";  
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
        {realm_receipts?.length > 0 ?
          <View style={styles.container}>
            <FlatList
              data={realm_receipts}
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