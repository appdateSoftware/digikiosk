import React, {useCallback, useEffect, useState} from 'react';
import { View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import { inject, observer } from "mobx-react";
import { useFocusEffect } from '@react-navigation/native';
import Colors from "../theme/colors";
import ErrorModal from "../components/modals/ErrorModal";
import { getUniqueId } from 'react-native-device-info';
import {useRealm, useQuery} from '@realm/react';

const DEFAULT_EMAIL = "defaultUser@gmail.com";

const DEFAULT_PSW = ")j~nKj/,N}N6,8&cVVV#G!=F*y";

const SplashScreen = ({navigation, feathersStore}) => { 

  const realm = useRealm();
  const realm_users = useQuery('User');
  
  const [errorModal, setErrorModal] = useState(false) ;
  const [uniqueId, setUniqueId] = useState(false) ;


  useFocusEffect(
    useCallback(() => {
      navigation.setOptions(
        {
          headerShown: false
        }
      )   
    }, [])
  );

  useEffect(() => {
    let lang = "el"
    if(realm){      
      realm.objects('Language')?.length == 0 ?
      realm.write(()=>{
        realm.create('Language',{
          name: 'el'
        })
      })
    :
    lang = realm.objects('Language')[0]?.name; 
    feathersStore.setLanguage(lang); 
    }  
    let invoiceType = "alp"
    if(realm){      
      realm.objects('InvoiceType')?.length == 0 ?
      realm.write(()=>{
        realm.create('InvoiceType',{
          name: 'alp'
        })
      })
    :
    invoiceType = realm.objects('InvoiceType')[0]?.name; 
    feathersStore.setInvoiceType(invoiceType); 
    } 

    let demoMode = true;
    if(realm){      
      realm.objects('Demo')?.length == 0 ?
      realm.write(()=>{
        realm.create('Demo',{
          val: true
        })
      })
      :
      demoMode = realm.objects('Demo')[0]?.val; 
      feathersStore.setDemoMode(demoMode); 
    } 
    
    if(realm){      
      if(realm_users?.length == 0){
        const user = {
          name : "Διαχειριστής",
          nameEnglish: "Administrator",
          role: 6,
          password: "1234",
          active: true
        }
        realm.write(()=>{
          realm.create('User', user)
        })
        feathersStore.setUser(user); 
      }else{
        const user = realm_users.find(u => u?.active)
        feathersStore.setUser(user); 
      }  
    } 
  }, [realm]); 

  useEffect(() => {   
    load(); 
  }, [realm])

  useEffect(() => {
    if(feathersStore.isAuthenticated)
      navigation.navigate('HomeNavigator', {screen: "Home"});  
  }, [feathersStore?.isAuthenticated])
 
  const load = async () => {
    try{  
      const _uniqueId = await getUniqueId();  
      setUniqueId(_uniqueId); 
      await feathersStore.connect();
      if(feathersStore.demoMode){         
        await feathersStore.login(DEFAULT_EMAIL, DEFAULT_PSW);
        feathersStore.setIsAuthenticated(true);      
      }else{
        await feathersStore.login(_uniqueId + "@gmail.com", DEFAULT_PSW);
        feathersStore.setIsAuthenticated(true);    
      }      
     
    }catch (error){
      setErrorModal(true);
      console.log(error);
    }
  }

  const closeErrorModal = () => {    
    setErrorModal(false);
  };

return(
  <>
    <View style={styles.container}>
      <View style={styles.txtContainer}>
        <Text style={styles.txt}>Digi-Kiosk</Text>
        <View style={[styles.indicator]}>
          <ActivityIndicator size="large" color="#fff"/>
        </View>
      </View >
      <View style={styles.appdateContainer}>
        <Text style={styles.appdateText} >Powered by AppDate</Text>
      </View>
    </View>
  
     <ErrorModal
      cancelButton={closeErrorModal}
      errorText={`Παρακαλώ επικοινωνείστε με digi-kiosk.com. DeviceId: ${uniqueId}`}
      visible={errorModal}
      uniqueId={uniqueId}
      uniqueIdText={'Αντιγραφή'}
    />
  </>
);
    
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: Colors.primaryColorDark,
    flex: 1
  }, 
  txtContainer:{
    flex: 1,    
    alignItems: "center",
    justifyContent: "center"
  },
  txt:{
    fontSize: 50,
   // color: "#F1FAEE"
   color: Colors.onPrimaryColor
  }, 
  indicator: {
    marginTop: 30
  },
  appdateContainer:{
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  appdateText:{
    color: "#fff",
   
  }
})

export default inject('feathersStore')(observer(SplashScreen));