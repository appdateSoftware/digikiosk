/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  NativeModules
} from "react-native";

//import mobx
import { inject, observer } from "mobx-react";

// import components
import Avatar from "../components/Avatar";
import Divider from "../components/Divider";
import Icon from "../components/Icon";
import {
  Heading6,
  Subtitle1,
  Subtitle2
} from "../components/text/CustomText";
import TouchableItem from "../components/TouchableItem";

// import colors
import Colors from "../theme/colors";

import ActivityIndicatorModal from "../components/modals/ActivityIndicatorModal";
import LanguageModal from "../components/modals/LanguageModal";
import _useTranslate from '../hooks/_useTranslate';
import InfoModal from "../components/modals/InfoModal";
import InputModal from "../components/modals/InputModal";


// SettingsA Config
const DIVIDER_MARGIN_LEFT = 60;
const arrowIcon = "arrow-forward";
const sectionsIcon = "grid-outline";
const usersIcon = "people-outline";
const aboutIcon = "storefront-outline";
const logoutIcon = "log-out-outline";
const loginIcon = "log-in-outline";

const greek = require("../assets/img/languages/greek.png");
const english = require("../assets/img/languages/us.png");
const germany = require("../assets/img/languages/germany.png");
const france = require("../assets/img/languages/france.png");
const spain = require("../assets/img/languages/spain.png");
const italy = require("../assets/img/languages/italy.png");



const {MyPosModule} = NativeModules;

// SettingsA Components
const Setting = ({ icon, title, onPress, extraData, disabled }) => (
  <TouchableItem onPress={onPress} disabled={disabled}>
    <View>
      <View style={[styles.row, styles.setting]}>
        <View style={styles.leftSide}>
          {icon !== undefined && (
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color={Colors.primaryColor} />
            </View>
          )}
          <Subtitle1 style={[styles.mediumText, disabled && styles.disabled]}>{title}</Subtitle1>
        </View>

        <Icon name={arrowIcon} size={16} color="rgba(0, 0, 0, 0.16)" />
      </View>

      {extraData ? (
        <View style={styles.extraDataContainer}>{extraData}</View>
      ) : (
        <View />
      )}
    </View>
  </TouchableItem>
);

// SetingsA
const SettingsA = ({navigation, feathersStore}) => { 
  
  let common = _useTranslate(feathersStore.language);
 
  const[avatarUrl, setAvatarUrl] = useState(require("../assets/img/face.png"));
  const [loading, setLoading] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [refund, setRefund] = useState("0");
  const [myPosError, setMyPosError] = useState(false);
  const [myPosErrorMessage, setMyPosErrorMessage] = useState("");
  const [refundModal, setRefundModal] = useState(false);


  const isMountedRef = useRef(null);

  useEffect(() => {
    isMountedRef.current = true;    
    return () => isMountedRef.current = false;
  }, [])
  
  useEffect(() => {   
    feathersStore.user?.facebookId && 
    setAvatarUrl(feathersStore.user.picture);    
  }, []);    
   
  const navigateTo = screen => () => {    
    navigation.navigate(screen);
  }; 

  const closeModal = () => {
    setLoading(false);
  }

  const openLanguageModal = () =>{
    setLanguageModal(true);
  }

  const closeLanguageModal = () =>{
    setLanguageModal(false);
  }   
  
  const findImage = (code)  => { 
    switch (code){
      case "el" :      
        return greek;
      case "en" :  
        return english;
      case "de" :
        return germany;
      case "fr" :
        return france;
      case "es" :
        return spain;
      case "it" :
        return italy;
    }
  }

  const logout =  async () => {   
  
    Alert.alert(
      common.logout,
      common.logoutWarning,
      [
        { text: common.cancel, onPress: () => {}, style: "cancel" },
        { text: "OK", onPress: async () => {                  
          try{
              isMountedRef.current && setLoading(true);
              await feathersStore.logout(); 
             // await feathersStore.login(config.DEFAULT_EMAIL, config.DEFAULT_PSW)
            //  navigation.
              navigation.push('SignIn');
              isMountedRef.current && setLoading(false);
          }catch{
              console.log('ERROR LOGGING OUT');
              isMountedRef.current && setLoading(false);
          }
        }}
      ],
      { cancelable: true }
    );
  };

  const goToLogin = () => {
    navigation.push("SignIn");      
  }

  const openRefundModal = () => {
    setRefundModal(true)
  }

  const myPosRefund = async() => {
    try{  
      if(refund > 0){
        setRefundModal(false);
        const transactionResult = await MyPosModule.makeMyPosRefund(+refund);
        setRefund("0");
        if (transactionResult.slice(-1) === "0" ) {      
          console.log("SUCCESS: ", transactionResult);
        }else{
          console.log("ERROR: ", transactionResult);      
          setMyPosError(true);
          setMyPosErrorMessage(transactionResult);
        }
      }else{
        return;
      }
    }catch(error){
      setRefund("0");
      setMyPosError(true);
      setMyPosErrorMessage(error);
    }
  }
  
 
  const closeErrorModal = () => {
    setMyPosError(false);
    setMyPosErrorMessage("");
  }

  const closeRefundModal = () => {
    setRefund("0");
    setRefundModal(false);
  }

  const onChangeRefund = text => {
    setRefund(text);
  }

  const addresses = feathersStore.user?.addresses;
  return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <View style={styles.titleContainer}>
            <Heading6 style={styles.titleText}>{common.settings}</Heading6>
          </View>
          {feathersStore.isAuthenticated &&
          <>
          <TouchableItem useForeground onPress={navigateTo("EditProfile")}>
            <View style={[styles.row, styles.profileContainer]}>
              <View style={styles.leftSide}>
                <Avatar
                  imageUri={feathersStore.user?.avatar ?
                    `${feathersStore.apiUrl}/images/${feathersStore.user?.avatar}` : avatarUrl}
                  rounded
                  size={60}
                />
                <View style={styles.profileInfo}>
                  <Subtitle1 style={styles.mediumText}>
                    {`${feathersStore.user?.firstname } ${feathersStore.user?.lastname }`}
                  </Subtitle1>
                  <Subtitle2 style={styles.email}>
                  {feathersStore.user?.email }
                  </Subtitle2>
                </View>
              </View>
            </View>
          </TouchableItem>
     
        
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />
          </>
          }

           
       
         
          
          {feathersStore.isAuthenticated && 
            <>
              <Setting
                onPress={navigateTo("Sections")}
                icon={sectionsIcon}
                title={common.sections}
              />
              <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />            
            </>
          }          

        
          {feathersStore.isAuthenticated &&  
            <>
              <Setting
                onPress={navigateTo("Users")}
                icon={usersIcon}
                title={common.users}
              />
              <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />
            </>
          }       

          <Setting
            onPress={navigateTo("Company")}
            icon={aboutIcon}
            title={common.company}
          />
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          <TouchableItem onPress={openLanguageModal}>
            <View>
              <View style={[styles.row, styles.setting]}>
                <View style={styles.leftSide}>
                  <View style={styles.iconContainer}>                    
                    <Image
                      source={findImage(feathersStore.language)}
                      style={ {width: 24 }}              
                      resizeMode="contain"
                    />                  
                  </View>
                  <Subtitle1 style={styles.mediumText}>
                    {common.language}
                  </Subtitle1>
                </View>
                <Icon name={arrowIcon} size={16} color="rgba(0, 0, 0, 0.16)" />
              </View>
            </View>
          </TouchableItem>
          <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />

          { feathersStore.settings?.myPos &&   
            <>
              <Setting
                onPress={openRefundModal}
                icon={"md-card"}
                title={common.myPosRefund}
              />
              <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />
            {/*
              <Setting
                onPress={myPosVoid}
                icon={"md-card-outline"}
                title={common.myPosVoid}
              />
              <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} />
          */}
            </>
          }

          <TouchableItem onPress={feathersStore.user?.firstname !== "default" ? logout : goToLogin}>
            <View style={[styles.row, styles.setting]}>
              <View style={styles.leftSide}>
                <View style={styles.iconContainer}>
                  <Icon
                    name={feathersStore.user?.firstname !== "default" ? logoutIcon : loginIcon}
                    size={24}
                    color={Colors.secondaryColor}
                  />
                </View>
                <Subtitle1 style={[styles.logout, styles.mediumText]}>
                  {feathersStore.user?.firstname !== "default" ?  common.logout : common.loginRegistration}
                </Subtitle1>
              </View>
            </View>
          </TouchableItem>
        </ScrollView>
        <ActivityIndicatorModal
            message={common.wait}
            onRequestClose={closeModal}
            title={common.logoutMessage}
            visible={loading}
        />
        <LanguageModal
          title={common.languageSelection}
          cancelButton={closeLanguageModal}        
          visible={languageModal}
        />
        <InfoModal
          message={myPosErrorMessage}
          iconName={"alert"}
          iconColor={Colors.primaryColorLight}
          title={common.failedTransaction}
          buttonTitle={common.exit}
          onButtonPress= {closeErrorModal}
          visible = {myPosError}          
        />
        <InputModal
          input={refund}   
          inputMethod={onChangeRefund}   
          message={common.refundMessage}
          title={common.myPosRefund}
          inputPlaceholder={common.refundPlaceholder}
          inputKeyboardType={"numeric"}
          buttonTitle={common.refundButtonTitle}
          onButtonPress={myPosRefund}
          onClosePress={closeRefundModal}
          closeButtonText={common.cancel}
          visible={refundModal}
        />
      </SafeAreaView>
      
    );  
}

// SettingsA Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  contentContainerStyle: {
    paddingBottom: 16
  },
  titleContainer: {
    paddingHorizontal: 16
  },
  titleText: {
    paddingTop: 16,
    paddingBottom: 24,
    fontWeight: "700"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16
  },
  profileContainer: {
    // height: 88
    paddingVertical: 16
  },
  leftSide: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  profileInfo: {
    paddingLeft: 16
  },
  mediumText: {
    fontWeight: "500"
  },
  email: {
    paddingVertical: 2
  },
  setting: {
    height: 56
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    width: 28,
    height: 28
  },
  extraDataContainer: {
    top: -8,
    marginLeft: DIVIDER_MARGIN_LEFT,
    paddingBottom: 8
  },  
  logout: { color: Colors.secondaryColor },
  disabled:{
    color: Colors.disabledText
  },
  alignCenter: {
    alignSelf: "center"
  }
});

export default inject('feathersStore')(observer(SettingsA));