import React, {useCallback, useEffect, useState} from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { inject, observer } from "mobx-react";
import { useFocusEffect } from '@react-navigation/native';
import Colors from "../theme/colors";
import ErrorModal from "../components/modals/ErrorModal";
import { getUniqueId } from 'react-native-device-info';

const DEFAULT_EMAIL = "defaultUser@gmail.com";

const DEFAULT_PSW = ")j~nKj/,N}N6,8&cVVV#G!=F*y";

const SplashScreen = ({navigation, feathersStore}) => { 
  
  const [errorModal, setErrorModal] = useState(false) ;

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
    load(); 
  }, [])

  useEffect(() => {
    if(feathersStore.isAuthenticated)
      navigation.navigate('HomeNavigator', {screen: "Home"});  
  }, [feathersStore?.isAuthenticated])
 
  const load = async () => {
    try{  
      const uniqueId = await getUniqueId();  
      console.log(uniqueId );
      await feathersStore.connect();      
      await feathersStore.login(uniqueId + "@gmail.com", DEFAULT_PSW)
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
      errorText={"Λάθος κωδικός. Παρακαλώ προσπαθείστε ξανά"}
      visible={errorModal}
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