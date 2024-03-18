import React, {useCallback, useEffect, useState} from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { inject, observer } from "mobx-react";
import { useFocusEffect } from '@react-navigation/native';
import Colors from "../theme/colors";
import ErrorModal from "../components/modals/ErrorModal";

const DEFAULT_EMAIL = "defaultUser@gmail.com";
const DEFAULT_PSW = ")j~nKj/,N}N6,8&cVVV#G!=F*y";

const SplashScreen = ({navigation, store1, feathersStore}) => { 
  
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
    if(feathersStore.isAuthenticated && feathersStore.user._id !== "5e109aaccf07d534f841e677")
      navigation.navigate('HomeNavigator', {screen: "Home"});  
  }, [feathersStore?.isAuthenticated, feathersStore?.user?._id])
 
  const load = async () => {
    try{   
      await feathersStore.connect();    
      await feathersStore.login(DEFAULT_EMAIL, DEFAULT_PSW)
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

export default inject('store1', 'feathersStore')(observer(SplashScreen));