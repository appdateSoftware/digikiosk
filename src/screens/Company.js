/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StatusBar, StyleSheet, View, SafeAreaView, Text,
  KeyboardAvoidingView, ScrollView} from "react-native";
import {Picker} from '@react-native-picker/picker';
import ActivityIndicatorModal from "../components/modals/ActivityIndicatorModal";
import ErrorModal from "../components/modals/ErrorModal";
import ContainedButton from "../components/buttons/ContainedButton";
import { Caption, Paragraph, Subtitle1, Subtitle2 } from "../components/text/CustomText";
import UnderlineTextInput from "../components/text/UnderlineTextInput";
import cloneDeep from 'lodash/cloneDeep';

import Colors from "../theme/colors";
import Validators from '../utils/validators';

import { inject, observer } from "mobx-react";

import _useTranslate from '../hooks/_useTranslate';

import {useRealm} from '@realm/react';

const PLACEHOLDER_TEXT_COLOR = "rgba(0, 0, 0, 0.4)";
const INPUT_TEXT_COLOR = "rgba(0, 0, 0, 0.87)";
const INPUT_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";
const INPUT_FOCUSED_BORDER_COLOR = "#000";
const BUTTON_BORDER_RADIUS = 4;

const Company = ({route, navigation, feathersStore }) => {

  const originsArray = [{
    "id" : 1,
    "label" : "Αττική1",
    "labelEnglish" : "Attica1"
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
  }]; 

  let common = _useTranslate(feathersStore.language);

  const realm = useRealm();

  const afmElement = useRef(null);
  const nameElement = useRef(null);
  const legalNameElement = useRef(null);
  const nameEnglishElement = useRef(null);
  const doyDescriptionElement = useRef(null);
  const legalDescriptionElement = useRef(null);
  const firmActDescriptionElement = useRef(null);
  const companyOriginElement = useRef(null);
  const postalAddressElement = useRef(null);
  const postalAddressNoElement = useRef(null);  
  const postalAreaDescriptionElement = useRef(null);
  const postalZipCodeElement = useRef(null);
  const companyPhoneElement = useRef(null);
  const companyEmailElement = useRef(null);
  const vendorElement = useRef(null);
  const printerIpElement = useRef(null);
  
  const [afm, setAfm] = useState('');
  const [name, setName] = useState(''); 
  const [legalName, setLegalName] = useState(''); 
  const [nameEnglish, setNameEnglish] = useState('');
  const [doyDescription, setDoyDescription] = useState(''); 
  const [legalDescription, setLegalDescription] = useState('');
  const [firmActDescription, setFirmActDescription] = useState('');
  const [companyOrigin, setCompanyOrigin] = useState(1);
  const [postalAddress, setPostalAddress] = useState('');
  const [postalAddressNo, setPostalAddressNo] = useState('');  
  const [postalAreaDescription, setPostalAreaDescription] = useState('');
  const [postalZipCode, setPostalZipCode] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [vendor, setVendor] = useState("");   
  const [printerIp, setPrinterIp] = useState("");  
  const [origins, setOrigins] = useState([]);
  
  const [afmFocused, setAfmFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false); 
  const [legalNameFocused, setLegalNameFocused] = useState(false);
  const [nameEnglishFocused, setNameEnglishFocused] = useState(false);
  const [doyDescriptionFocused, setDoyDescriptionFocused] = useState(false); 
  const [legalDescriptionFocused, setLegalDescriptionFocused] = useState(false);
  const [firmActDescriptionFocused, setFirmActDescriptionFocused] = useState(false);
  const [companyOriginFocused, setCompanyOriginFocused] = useState(false);
  const [postalAddressFocused, setPostalAddressFocused] = useState(false);
  const [postalAddressNoFocused, setPostalAddressNoFocused] = useState(false);  
  const [postalAreaDescriptionFocused, setPostalAreaDescriptionFocused] = useState(false);
  const [postalZipCodeFocused, setPostalZipCodeFocused] = useState(false);
  const [companyPhoneFocused, setCompanyPhoneFocused] = useState(false);
  const [companyEmailFocused, setCompanyEmailFocused] = useState(false);
  const [vendorFocused, setVendorFocused] = useState(false);
  const [printerIpFocused, setPrinterIpFocused] = useState(false);          
 
  const [afmError, setAfmError] = useState(false);
  const [nameError, setNameError] = useState(false); 
  const [legalNameError, setLegalNameError] = useState(false);
  const [nameEnglishError, setNameEnglishError] = useState(false);
  const [doyDescriptionError, setDoyDescriptionError] = useState(false); 
  const [legalDescriptionError, setLegalDescriptionError] = useState(false);
  const [firmActDescriptionError, setFirmActDescriptionError] = useState(false);
  const [postalAddressError, setPostalAddressError] = useState(false);
  const [postalAddressNoError, setPostalAddressNoError] = useState(false);  
  const [postalAreaDescriptionError, setPostalAreaDescriptionError] = useState(false);
  const [postalZipCodeError, setPostalZipCodeError] = useState(false);
  const [companyPhoneError, setCompanyPhoneError] = useState(false);
  const [companyEmailError, setCompanyEmailError] = useState(false);
  const [vendorError, setVendorError] = useState(false);
  const [printerIpError, setPrinterIpError] = useState(false); 

 
  const [isLoading, setIsLoading] = useState(false);
  const [edit, setEdit] = useState(false);  
  const [errorModal, setErrorModal] = useState(false) ;   

  useEffect(() => {    
      const realmItems = realm.objects('Company');
      if(realmItems?.length > 0){
        loadCompany(realmItems[0]);
        setEdit(true);
      }
  }, [realm]);

  useEffect(()=> {
    setOrigins(originsArray);    
  },[]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide
    );
    return () =>{
      keyboardDidHideListener.remove();
    }  
  },  []);  

 const loadCompany = (companyFromDB) => {  
    setNameEnglish(companyFromDB.nameEnglish);
    setName(companyFromDB.name);
    setLegalName(companyFromDB.legalName);
    setAfm(companyFromDB.afm);
    setLegalDescription(companyFromDB.legalDescription);    
    setDoyDescription(companyFromDB.doyDescription)
    setFirmActDescription(companyFromDB.firmActDescription);
    setCompanyOrigin(companyFromDB.companyOrigin);
    setPostalAddress(companyFromDB.postalAddress);
    setPostalAddressNo(companyFromDB.postalAddressNo);
    setPostalAreaDescription(companyFromDB.postalAreaDescription);
    setPostalZipCode(companyFromDB.postalZipCode);
    setCompanyPhone(companyFromDB.companyPhone);
    setCompanyEmail(companyFromDB.companyEmail);
    setVendor(companyFromDB.vendor);  
    setPrinterIp(companyFromDB.printerIp); 
  }

  const keyboardDidHide = () => {    
      setNameFocused(false);
      setLegalNameFocused(false);
      setNameEnglishFocused(false);
      setAfmFocused(false);  
      setDoyDescriptionFocused(false);
      setLegalDescriptionFocused(false);
      setFirmActDescriptionFocused(false);
      setCompanyOriginFocused(false);
      setPostalAddressFocused(false);
      setPostalAddressNoFocused(false);
      setPostalAreaDescriptionFocused(false);
      setPostalZipCodeFocused(false);
      setCompanyPhoneFocused(false);
      setCompanyEmailFocused(false);
      setVendorFocused(false);
      setPrinterIpFocused(false);
  }

  const goBack = () => {   
    navigation.goBack();
  };
  
  const onChangeText = key => (text) => {
    switch(key){
      case "nameEnglish" : 
        setNameEnglish(text);
        nameEnglishValidation(text);      
        break;
      case "name" : 
        setName(text);
        nameValidation(text);      
        break;  
      case "legalName" : 
        setLegalName(text);
        legalNameValidation(text);       
        break;     
      case "afm" : 
        setAfm(text);
        afmValidation(text);      
        break;
      case "doyDescription" : 
        setDoyDescription(text);
        doyDescriptionValidation(text);
        break;
      case "legalDescription" : 
        setLegalDescription(text);
        legalDescriptionValidation(text);
        break;
      case "firmActDescription" : 
        setFirmActDescription(text);
        firmActDescriptionValidation(text);
        break;
      case "postalAddress" : 
        setPostalAddress(text);
        postalAddressValidation(text);
        break;
      case "postalAddressNo" : 
        setPostalAddressNo(text);
        postalAddressNoValidation(text);
        break;
      case "postalAreaDescription" : 
        setPostalAreaDescription(text);
        postalAreaDescriptionValidation(text);
        break;
      case "postalZipCode" : 
        setPostalZipCode(text);
        postalZipCodeValidation(text);
        break;
      case "companyPhone" : 
        setCompanyPhone(text);
        companyPhoneValidation(text);
        break;
      case "companyEmail" : 
        setCompanyEmail(text);
        companyEmailValidation(text);
        break;
      case "vendor" : 
        setVendor(text);
        vendorValidation(text);        
       break;
      case "printerIp" : 
        setPrinterIp(text);
        printerIpValidation(text);
        break;
    }
  };

  const onFocus = key => () => {    
    keyboardDidHide();  
    
    switch(key){
      case "nameEnglishFocused" : setNameEnglishFocused(true);
      break;
      case "nameFocused" : setNameFocused(true);
      break;
      case "legalNameFocused" : setLegalNameFocused(true);
      break;
      case "afmFocused" : setAfmFocused(true);
      break;
      case "doyDescriptionFocused" : setDoyDescriptionFocused(true);
      break;  
      case "legalDescriptionFocused" : setLegalDescriptionFocused(true);
      break;
      case "firmActDescriptionFocused" : setFirmActDescriptionFocused(true);
      break;
      case "companyOriginFocused" : setCompanyOriginFocused(true);
      break;
      case "postalAddressFocused" : setPostalAddressFocused(true);
      break;
      case "postalAddressNoFocused" : setPostalAddressNoFocused(true);
      break;
      case "postalAreaDescriptionFocused" : setPostalAreaDescriptionFocused(true);
      break;
      case "postalZipCodeFocused" : setPostalZipCodeFocused(true);
      break;
      case "companyPhoneFocused" : setCompanyPhoneFocused(true);
      break;
      case "companyEmailFocused" : setCompanyEmailFocused(true);
      break;
      case "vendorFocused" : setVendorFocused(true);
      break;  
      case "printerIpFocused" : setPrinterIpFocused(true);
      break;      
    }
  };

    const nameValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setNameError(true);
      }else{
        setNameError(false);
      }   
    }

    const legalNameValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setLegalNameError(true);
      }else{
        setLegalNameError(false);
      }   
    }
    
    const nameEnglishValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setNameEnglishError(true);
      }else{
        setNameEnglishError(false);
      }   
    } 

    const afmValidation = val => {
      if (!Validators.validateAfm(val) ) {
        setAfmError(true);
      }else{
        setAfmError(false);
      }   
    }
    
    const doyDescriptionValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setDoyDescriptionError(true);
      }else{
        setDoyDescriptionError(false);
      }   
    } 
  
    const legalDescriptionValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setLegalDescriptionError(true);
      }else{
        setLegalDescriptionError(false);
      }   
    } 
  
    const firmActDescriptionValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setFirmActDescriptionError(true);
      }else{
        setFirmActDescriptionError(false);
      }   
    } 
  
    const postalAddressValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setPostalAddressError(true);
      }else{
        setPostalAddressError(false);
      }   
    } 
  
    const postalAddressNoValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setPostalAddressNoError(true);
      }else{
        setPostalAddressNoError(false);
      }   
    } 
  
    const postalAreaDescriptionValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setPostalAreaDescriptionError(true);
      }else{
        setPostalAreaDescriptionError(false);
      }  
    }   
    
    const postalZipCodeValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setPostalZipCodeError(true);
      }else{
        setPostalZipCodeError(false);
      }  
    }  
  
    const companyPhoneValidation = val => {
      if (!Validators.validatePhone(val) ) {
        setCompanyPhoneError(true);
      }else{
        setCompanyPhoneError(false);
      }  
    }  
  
    const companyEmailValidation = val => {
      if (!Validators.validateEmail(val) ) {
        setCompanyEmailError(true);
      }else{
        setCompanyEmailError(false);
      }  
    }  
  
    const vendorValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setVendorError(true);
      }else{
        setVendorError(false);
      }  
    }  

    const printerIpValidation = val => {
      if (!Validators.validateNonEmpty(val) ) {
        setPrinterIpError(true);
      }else{
        setPrinterIpError(false);
      }  
    }
  

  const focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const saveCompany = async() => {
    Keyboard.dismiss();      

    const data = {
      afm: +afm, nameEnglish,  name, legalName, doyDescription, legalDescription, firmActDescription,
      companyOrigin, postalAddress, postalAddressNo, postalAreaDescription, postalZipCode, companyPhone,
      companyEmail, vendor, printerIp
    };        
    try{
      if(edit){      //---------> Edit
        let updt = realm.objects('Company');         
        realm.write(()=>{     
          updt[0].afm = afm;
          updt[0].nameEnglish = nameEnglish;
          updt[0].name = name;
          updt[0].legalName = legalName;
          updt[0].doyDescription = doyDescription;
          updt[0].legalDescription = legalDescription;
          updt[0].firmActDescription = firmActDescription;
          updt[0].companyOrigin = +companyOrigin;
          updt[0].postalAddress = postalAddress;
          updt[0].postalAddressNo = postalAddressNo;
          updt[0].postalAreaDescription = postalAreaDescription;
          updt[0].postalZipCode = postalZipCode;
          updt[0].companyPhone = companyPhone;
          updt[0].companyEmail = companyEmail;
          updt[0].vendor = vendor;        
          updt[0].printerIp = printerIp;
        }) 
      } else{   //------------> Create
        realm.write(()=>{     
          realm.create('Company', data, false); //do not use primarykey 
        }) 
      } 
      closeModal();
    }catch (err){
      setIsLoading(false);
      setErrorModal(true);
    }
  };

  const closeModal = () => {    
    setIsLoading(false);    
    goBack();
  };

  const closeErrorModal = () => {    
    setErrorModal(false); 
  };

   
  return (  
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />

    <KeyboardAvoidingView
      behavior= {"height"}
      style={styles.formContainer}  
      keyboardVerticalOffset = {100}
    >
      <ScrollView style={styles.form}>    

        <UnderlineTextInput   
          autoFocus={true}
          ref={nameElement}
          value={name}  
          onChangeText={onChangeText("name")}
          onFocus={onFocus("nameFocused")}
          inputFocused={nameFocused}
          onSubmitEditing={focusOn(legalNameElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.name}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {nameError && <Text style={styles.errorText}>{common.nameError}</Text>}
        </View>

        <UnderlineTextInput   
          ref={legalNameElement}
          value={legalName}  
          onChangeText={onChangeText("legalName")}
          onFocus={onFocus("legalNameFocused")}
          inputFocused={legalNameFocused}
          onSubmitEditing={focusOn(nameEnglishElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.legalName}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {legalNameError && <Text style={styles.errorText}>{common.legalNameError}</Text>}
        </View>

        <UnderlineTextInput
          ref={nameEnglishElement}
          value={nameEnglish}                
          onChangeText={onChangeText("nameEnglish")}
          onFocus={onFocus("nameEnglishFocused")}
          inputFocused={nameEnglishFocused}
          onSubmitEditing={focusOn(nameElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.nameEnglish}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}          
        />
        <View style={styles.errorContainer}>
          {nameEnglishError && <Text style={styles.errorText}>{common.nameEnglishError}</Text>}
        </View>

        <UnderlineTextInput         
          ref={afmElement}
          value={afm}
          onChangeText={onChangeText("afm")}
          onFocus={onFocus("afmFocused")}
          inputFocused={afmFocused}
          onSubmitEditing={focusOn(legalDescriptionElement)}            
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={`${common.companyAfm}*`}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}          
          keyboardType='number-pad'
        />
        <View style={styles.errorContainer}>
          {afmError && <Text style={styles.errorText}>{common.afmError}</Text>}
        </View>

        <UnderlineTextInput
          ref={legalDescriptionElement}
          value={legalDescription}  
          onChangeText={onChangeText("legalDescription")}
          onFocus={onFocus("legalDescriptionFocused")}
          inputFocused={legalDescriptionFocused}
          onSubmitEditing={focusOn(doyDescriptionElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.legalDescription}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {legalDescriptionError && <Text style={styles.errorText}>{common.legalNameError}</Text>}
        </View>

        <UnderlineTextInput
          ref={doyDescriptionElement}
          value={doyDescription}  
          onChangeText={onChangeText("doyDescription")}
          onFocus={onFocus("doyDescriptionFocused")}
          inputFocused={doyDescriptionFocused}
          onSubmitEditing={focusOn(firmActDescriptionElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.doyDescription}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {doyDescriptionError && <Text style={styles.errorText}>{common.doyDescriptionError}</Text>}
        </View>
      
        <UnderlineTextInput
          ref={firmActDescriptionElement}
          value={firmActDescription}  
          onChangeText={onChangeText("firmActDescription")}
          onFocus={onFocus("firmActDescriptionFocused")}
          inputFocused={firmActDescriptionFocused}
          onSubmitEditing={focusOn(companyOriginElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.firmActDescription}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {firmActDescriptionError && <Text style={styles.errorText}>{common.firmActDescriptionError}</Text>}
        </View>

        <Picker
          ref={companyOriginElement}
          selectedValue={+companyOrigin}
          onValueChange={(itemValue, itemIndex) =>
            setCompanyOrigin(itemValue)
          }>
          {origins?.map((i, index)=> (              
            <Picker.Item key={index}  color={Colors.primaryText} label={i.label} value={+i.id}/>
          ))}        
        </Picker>

        <UnderlineTextInput
          ref={postalAddressElement}
          value={postalAddress}  
          onChangeText={onChangeText("postalAddress")}
          onFocus={onFocus("doyDescriptionFocused")}
          inputFocused={postalAddressFocused}
          onSubmitEditing={focusOn(postalAddressNoElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.postalAddress}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAddressError && <Text style={styles.errorText}>{common.postalAddressError}</Text>}
        </View>

        <UnderlineTextInput
          ref={postalAddressNoElement}
          value={postalAddressNo}  
          onChangeText={onChangeText("postalAddressNo")}
          onFocus={onFocus("doyDescriptionFocused")}
          inputFocused={postalAddressNoFocused}
          onSubmitEditing={focusOn(postalAreaDescriptionElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.postalAddressNo}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAddressNoError && <Text style={styles.errorText}>{common.postalAddressNoError}</Text>}
        </View>

        <UnderlineTextInput
          ref={postalAreaDescriptionElement}
          value={postalAreaDescription}  
          onChangeText={onChangeText("postalAreaDescription")}
          onFocus={onFocus("doyDescriptionFocused")}
          inputFocused={postalAreaDescriptionFocused}
          onSubmitEditing={focusOn(postalZipCodeElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.postalAreaDescription}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAreaDescriptionError && <Text style={styles.errorText}>{common.postalAreaDescriptionError}</Text>}
        </View>
        
        <UnderlineTextInput
          ref={postalZipCodeElement}
          value={postalZipCode}  
          onChangeText={onChangeText("postalZipCode")}
          onFocus={onFocus("postalZipCodeFocused")}
          inputFocused={postalZipCodeFocused}
          onSubmitEditing={focusOn(companyPhoneElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.postalZipCode}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalZipCodeError && <Text style={styles.errorText}>{common.postalZipCodeError}</Text>}
        </View>

        <UnderlineTextInput
          ref={companyPhoneElement}
          value={companyPhone}  
          onChangeText={onChangeText("companyPhone")}
          onFocus={onFocus("companyPhoneFocused")}
          inputFocused={companyPhoneFocused}
          onSubmitEditing={focusOn(companyEmailElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.companyPhone}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {companyPhoneError && <Text style={styles.errorText}>{common.companyPhoneError}</Text>}
        </View>

        <UnderlineTextInput
          ref={companyEmailElement}
          value={companyEmail}  
          onChangeText={onChangeText("companyEmail")}
          onFocus={onFocus("companyEmailFocused")}
          inputFocused={companyEmailFocused}
          onSubmitEditing={focusOn(vendorElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.companyEmail}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {companyEmailError && <Text style={styles.errorText}>{common.companyEmailError}</Text>}
        </View>

        <UnderlineTextInput
          ref={vendorElement}
          value={vendor}  
          onChangeText={onChangeText("vendor")}
          onFocus={onFocus("vendorFocused")}
          inputFocused={vendorFocused}
          onSubmitEditing={focusOn(printerIpElement)}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.vendor}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {vendorError && <Text style={styles.errorText}>{common.vendorError}</Text>}
        </View>

        <UnderlineTextInput
          ref={printerIpElement}
          value={printerIp}  
          onChangeText={onChangeText("printerIp")}
          onFocus={onFocus("vendorFocused")}
          inputFocused={printerIpFocused}
          returnKeyType="next"
          blurOnSubmit={false}
          placeholder={common.printerIp}
          placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
          inputTextColor={INPUT_TEXT_COLOR}
          borderColor={INPUT_BORDER_COLOR}
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {printerIpError && <Text style={styles.errorText}>{common.printerIpError}</Text>}
        </View>

        <View style={styles.vSpacer}></View> 
        <View style={styles.saveButton}>                       
          <ContainedButton
            onPress={saveCompany}
            color={Colors.primaryColor}
            socialIconName="check"
            iconColor={Colors.onPrimaryColor} 
            title={common.save}
            titleColor={Colors.onPrimaryColor} 
            titleStyle={styles.buttonTitle} 
            disabled={!companyPhone || companyPhoneError || 
              !companyEmail || companyEmailError || !aadeResponseRef.current}
          /> 
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
    <ActivityIndicatorModal
      message={common.wait}
      onRequestClose={closeModal}
      title={common.waitStorage}
      visible={isLoading}
    />
    <ErrorModal
      cancelButton={closeErrorModal}
      errorText={common.otherName}
      visible={errorModal}
    />        
  </SafeAreaView>
);  
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24
  }, 
 
  picker: {
    justifyContent: "center",
    alignItems: "center",
    width: 104
  },  
 
  inputStyle: {
    textAlign: "left"
  }, 

  formContainer: {
    flex: 1,      
    backgroundColor: Colors.background,
    justifyContent: "space-between", 
  },
  form: {       
    paddingHorizontal: 20
  },
 
  inputContainerStyle: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0
  },
 
  errorText: {
    color: Colors.error,
    fontSize: 12, 
    marginBottom: -12    
  },
  errorContainer: { height: 14},
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  }, 

  buttonTitle: {
    paddingHorizontal: 0,
    fontSize: 15,
    fontWeight: "700"
  },
  vSpacer: {
    height: 25
  },  
});

export default inject('feathersStore')(observer(Company));
