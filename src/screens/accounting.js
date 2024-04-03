/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, Fragment } from "react";
import { 
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView
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
import LinkButton from "../components/buttons/LinkButton";
import CalendarModal from "../components/modals/CalendarModal";
import Text from '../components/Text';
import TcpSocket from 'react-native-tcp-socket';
import {EscPos} from '@tillpos/xml-escpos-helper';


import Colors from "../theme/colors";

//import mobx
import { inject, observer } from "mobx-react";

// Translations
import _useTranslate from '../hooks/_useTranslate';

// DeliverySectionA Config
const printIcon = "print-outline";

// DeliverySectionA Component
const Line = ({  
  cell1,
  cell2,
  cell3,
  cell4
}) => (
  
    <View style={[styles.line]}>           
      <Text style={styles.section}>
        {cell1 ? `${cell1}` : ""}
      </Text>
      <Text style={[styles.dataCell]}>
        {cell2 ? `${cell2}` : "0.00"}
      </Text>  
      <Text style={[styles.dataCell]}>
        {cell3 ? `${cell3}` : "0.00"}
      </Text>  
      <Text style={[styles.dataCell]}>
        {cell4 ? `${cell4}` : "0.00"}
      </Text>     
    </View>

);

const AccountingScreen =({feathersStore}) => {

  const realm = useRealm();
  const realm_receipts = useQuery('Receipt');
  const realm_company = useQuery("Company");
  const realm_unprinted = useQuery('Unprinted');

  let common = _useTranslate(feathersStore.language);

  const [indicatorModal, setIndicatorModal] = useState(false) ;
  const [from, setFrom] = useState(null) ;
  const [to, setTo] = useState(null) ;
  const [showFromModal, setShowFromModal] = useState(false) ;
  const [showToModal, setShowToModal] = useState(false) ;
  const [filteredReceipts, setFilteredReceipts] = useState([]) ;
  const [vats, setVats] = useState([]) ;



  useEffect(() => {
    setFrom(DateTime.now().startOf("month").toISODate());
    setTo(DateTime.now().toISODate());
    setVats(AppSchema.vatsArray)
  }, []);

  useEffect(() => {
    const filtered = realm_receipts.filtered('createdAt > $0 && createdAt < $1'
    , toTimeStamp(from), toTimeStamp(to));
    setFilteredReceipts(filtered);
  }, [from, to])

  const printThermal = req => async() =>{
    await printLocally(req)
  } 
  
  const findRetailNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["alp", "apy"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findWholeSalesNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["tpy", "tda"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findTotalNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["alp", "apy", "tpy", "tda"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findRetailVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["alp", "apy"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.vatAmount)
      .reduce((a,b) => +a + +b, 0);
  }

  const findWholeSalesVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["tpy", "tda"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.vatAmount)
      .reduce((a,b) => +a + +b, 0);
  }

  const findTotalVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["alp", "apy", "tpy", "tda"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.vatAmount)
      .reduce((a,b) => +a + +b, 0);
  }

  const findRetailDebitVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["psl"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findWholeSalesDebitVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["pt"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findTotalDebitVat = (vatId) => {
    return filteredReceipts
      .filter(r => ["psl", "pt"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findRetailDebitNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["psl"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findWholeSalesDebitNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["pt"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findTotalDebitNet = (vatId) => {
    return filteredReceipts
      .filter(r => ["psl", "pt"].includes(r.receiptKind))
      .map(rec => JSON.parse(rec.vatAnalysis)[`vat${vatId}`] || 0)
      .map(vatAnalysis => vatAnalysis.underlyingValue)
      .reduce((a,b) => +a + +b, 0);
  }

  const findTotalRetailNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findRetailNet(vat.id)
    }
    return sum;     
  }

  const findTotalWholeSalesNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findWholeSalesNet(vat.id)
    }
    return sum;  
  }

  const findTotalAllNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findTotalNet(vat.id)
    }
    return sum;  
  }

  const findTotalRetailVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findRetailVat(vat.id)
    }
    return sum;  
  }

  const findTotalWholeSalesVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findWholeSalesVat(vat.id)
    }
    return sum;  
  }

  const findTotalAllVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findTotalVat(vat.id)
    }
    return sum;  
  }

  const findTotalRetailDebitNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findRetailDebitNet(vat.id)
    }
    return sum;     
  }

  const findTotalWholeSalesDebitNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findWholeSalesDebitNet(vat.id)
    }
    return sum;  
  }

  const findTotalAllDebitNet = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findTotalDebitNet(vat.id)
    }
    return sum;  
  }

  const findTotalRetailDebitVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findRetailDebitVat(vat.id)
    }
    return sum;  
  }

  const findTotalWholeSalesDebitVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findWholeSalesDebitVat(vat.id)
    }
    return sum;  
  }

  const findTotalAllDebitVat = () => {
    let sum = 0;
    for (let vat of AppSchema.vatsArray){
      sum = sum + +findTotalDebitVat(vat.id)
    }
    return sum;  
  }

  
  const closeIndicatorModal = () => {    
    setIndicatorModal(false); 
  }; 

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

  const parse_fix = price => {
    return price ? parseFloat(price).toFixed(2) : 0;
  } 


  return ( 
      <SafeAreaView style={styles.screenContainer}>
        
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />   
        <View style={styles.header}>        
          <View style={styles.headerSection}>
            <Text>{common.fromTitle}</Text>
            <LinkButton
              onPress={() => setShowFromModal(true)} 
              title={toGreekLocale(from)}         
            />
          </View>
          <View style={styles.headerSection}>
            <Text>{common.toTitle}</Text>
            <LinkButton
              onPress={() => setShowToModal(true)} 
              title={toGreekLocale(to)}         
            />
          </View>
          <View style={styles.headerButtonSection}>
            <TouchableItem style={styles.end} borderless  onPress={printThermal}>
              <View style={styles.iconContainer}>
                <Icon name={printIcon} size={21} color={Colors.secondaryText}/>                       
              </View>
            </TouchableItem> 
          </View>
          
        </View> 
        <ScrollView style={styles.container}>
          {vats?.filter(itm => findRetailNet(itm.id) > 0).map((item, index) => {
            return(              
              <Fragment key={index}>
              <View style={styles.subHeader}><Text>{common.sales} {item.label}%</Text></View>
              <Line cell2={common.retail} cell3={common.wholesales} cell4={common.totalCap}/>
              <Line 
                cell1={common.net} 
                cell2={parse_fix(findRetailNet(item.id))}
                cell3={parse_fix(findWholeSalesNet(item.id))}
                cell4={parse_fix(findTotalNet(item.id))}
              />
              <Line 
                cell1={`${common.vat} ${item.label}%`}
                cell2={parse_fix(findRetailVat(item.id))}
                cell3={parse_fix(findWholeSalesVat(item.id))}
                cell4={parse_fix(findTotalVat(item.id))}
              />
              <Line 
                cell1={common.gross}  
                cell2={parse_fix(+findRetailNet(item.id) + +findRetailVat(item.id))}
                cell3={parse_fix(+findWholeSalesNet(item.id) + +findWholeSalesVat(item.id))}
                cell4={parse_fix(+findTotalNet(item.id) + +findTotalVat(item.id))} 
              />  
              <Divider/>   
              </Fragment>  )     
          })                     
          }
          <View style={styles.bottomSection}>
            <View style={styles.subHeader}><Text>{common.totalSales}</Text></View>
            <Line cell2={common.retail} cell3={common.wholesales} cell4={common.totalCap}/>
            <Line cell1={common.quantityC} cell2={"0"} cell3={"0"} cell4={"0"}/>
            <Line 
              cell1={common.gross}

            />
            <Line 
              cell1={common.debit}
              cell2={parse_fix(+findTotalRetailDebitNet() + +findTotalRetailDebitVat())}
              cell3={parse_fix(+findTotalWholeSalesDebitNet() + +findTotalWholeSalesDebitVat())}
              cell4={parse_fix(+findTotalAllDebitNet() + +findTotalAllDebitVat())}
            /> 
            <Line 
              cell1={common.net}
              cell2={parse_fix(findTotalRetailNet())}
              cell3={parse_fix(findTotalWholeSalesNet())}
              cell4={parse_fix(findTotalAllNet())}
            />
            <Line 
              cell1={common.vat}
              cell2={parse_fix(findTotalRetailVat() - findTotalRetailDebitVat())}
              cell3={parse_fix(findTotalWholeSalesVat() - findTotalWholeSalesDebitVat())}
              cell4={parse_fix(findTotalAllVat() - findTotalAllDebitVat())}
            />
            <Divider/>   
            <Line 
              cell1={common.totalCap}
              cell2={parse_fix(+findTotalRetailNet() + +findTotalRetailVat())}
              cell3={parse_fix(+findTotalWholeSalesNet() + +findTotalWholeSalesVat())}
              cell4={parse_fix(+findTotalAllNet() + +findTotalAllVat())}
            />
            <Line 
              cell1={common.average}/> 
            <Divider/>
          </View>
        </ScrollView> 
       
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeIndicatorModal}
          title={common.waitStorage}
          visible={indicatorModal}
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
    backgroundColor: Colors.background,
  },
  container: {
    padding: 12,
    paddingBottom: 0
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
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonSection: {
    flexDirection: "row",
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  subHeader:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 2,
  },
  line: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 2,   
  },
  section: { 
    width: "25%",
    flexDirection: "row",
  },
  dataCell:{
    width: "25%",
    flexDirection: "row",
    justifyContent: "flex-end",
  }, 
  end: {
    flex: 1,
    alignSelf: "flex-end"  
  },
  bottomSection: {
    marginTop: 12,
    marginBottom: 16
  }
});

export default inject('feathersStore')(observer(AccountingScreen));