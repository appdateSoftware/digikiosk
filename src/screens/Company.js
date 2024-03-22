/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect } from "react";
import { Keyboard, StatusBar, StyleSheet, View, SafeAreaView,
  KeyboardAvoidingView, ScrollView} from "react-native";
import {Picker} from '@react-native-picker/picker';
import ActivityIndicatorModal from "../../components/modals/ActivityIndicatorModal";
import ErrorModal from "../../components/modals/ErrorModal";
import Button from "../../components/buttons/Button";
import { Caption, Paragraph, Subtitle1, Subtitle2 } from "../../components/text/CustomText";
import UnderlineTextInput from "../../components/text/UnderlineTextInput";
import cloneDeep from 'lodash/cloneDeep';

import Colors from "../../theme/colors";

import { inject, observer } from "mobx-react";

import _useTranslate from '../../hooks/_useTranslate';

import {useRealm} from '@realm/react';

const PLACEHOLDER_TEXT_COLOR = "rgba(0, 0, 0, 0.4)";
const INPUT_TEXT_COLOR = "rgba(0, 0, 0, 0.87)";
const INPUT_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";
const INPUT_FOCUSED_BORDER_COLOR = "#000";
const BUTTON_BORDER_RADIUS = 4;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24
  }, 
  instructionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    justifyContent: "center",
    alignItems: "center",
    width: 104
  },
  touchArea: {
    marginHorizontal: 16,
    marginBottom: 6,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(35, 47, 52, 0.12)",
    overflow: "hidden"
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 22
  },
  instruction: {
    marginTop: 32,
    paddingHorizontal: 40,
    fontSize: 14,
    textAlign: "center"
  },
  form: {
    padding: 12
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%"
  },
  inputContainer: {
    margin: 8
  },
  small: {
    flex: 2
  },
  large: {
    flex: 5
  },
  inputStyle: {
    textAlign: "left"
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center" 
  }, 
  inputContainerStyle: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  cityTitle: {
    color: PLACEHOLDER_TEXT_COLOR,
    alignSelf: "center",
    paddingLeft: 6
  },
});

let nameEnglishElement;
let nameElement;
let afmElement;
let legalNameElement;
let tokenElement;
let doyElement;
let addressElement;
let phoneElement;
let ypahesElement;

const Company = ({route, navigation, feathersStore }) => {

  let common = _useTranslate(feathersStore.language);

  const realm = useRealm();
   
  const [name, setName] = useState("");  
  const [nameFocused, setNameFocused] = useState(false);   
  const [nameEnglish, setNameEnglish] = useState("");   
  const [nameEnglishFocused, setNameEnglishFocused] = useState(false);   
  const [legalName, setLegalName] = useState("");    
  const [legalNameFocused, setLegalNameFocused] = useState(false);   
  const [afm, setAfm] = useState("");    
  const [afmFocused, setAfmFocused] = useState(false);    
  const [token, setToken] = useState("");    
  const [tokenFocused, setTokenFocused] = useState(false);    
  const [doy, setDoy] = useState("");    
  const [doyFocused, setDoyFocused] = useState(false); 
  const [address, setAddress] = useState("");    
  const [addressFocused, setAddressFocused] = useState(false);   
  const [phone, setPhone] = useState("");    
  const [phoneFocused, setPhoneFocused] = useState(false);  
  const [ypahes, setYpahes] = useState("");    
  const [ypahesFocused, setYpahesFocused] = useState(false);          
  const [modalVisible, setModalVisible] = useState(false);    
  const [edit, setEdit] = useState(false);  
  const [errorModal, setErrorModal] = useState(false) ;   

  useEffect(() => {    
      const realmItems = realm.objects('Company');
      if(realmItems?.length > 0){
        loadCompany(realmItems[0]);
        setEdit(true);
      }
  }, [realm]);

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
    setAfm(companyFromDB.afm);
    setLegalName(companyFromDB.legalName); 
    setToken(companyFromDB.token)
    setDoy(companyFromDB.doy)  
    setAddress(companyFromDB.address)  
    setPhone(companyFromDB.phone)
    setYpahes(companyFromDB.ypahes)
  }

  const keyboardDidHide = () => {    
      setNameFocused(false);
      setNameEnglishFocused(false);
      setLegalNameFocused(false);
      setAfmFocused(false);  
      setTokenFocused(false);
      setDoyFocused(false);
      setAddressFocused(false);
      setPhoneFocused(false);
      setYpahesFocused(false);
  }

  const goBack = () => {   
    navigation.goBack();
  };
  
  const onChangeText = key => (text) => {
    switch(key){
      case "nameEnglish" : setNameEnglish(text);
      break;
      case "name" : setName(text);
      break;
      case "legalName" : setLegalName(text);
      break;
      case "afm" : setAfm(text);
      break;
      case "token" : setToken(text);
      break;
      case "doy" : setDoy(text);
      break;
      case "address" : setAddress(text);
      break;
      case "phone" : setPhone(text);
      break;
      case "ypahes" : setYpahes(text);
      break;
    }
  };

  const onFocus = key => () => {    
    setNameFocused(false);
    setNameEnglishFocused(false);
    setLegalNameFocused(false);
    setAfmFocused(false);  
    setTokenFocused(false);
    setDoyFocused(false);
    setAddressFocused(false);
    setPhoneFocused(false);
    setYpahesFocused(false);
   
      switch(key){
        case "nameEnglishFocused" : setNameEnglishFocused(true);
        break;
        case "nameFocused" : setNameFocused(true);
        break;
        case "afmFocused" : setAfmFocused(true);
        break;
        case "legalNameFocused" : setLegalNameFocused(true);
        break;  
        case "tokenFocused" : setTokenFocused(true);
        break;
        case "doyFocused" : setDoyFocused(true);
        break;
        case "addressFocused" : setAddressFocused(true);
        break;
        case "phoneFocused" : setPhoneFocused(true);
        break;
        case "ypahesFocused" : setYpahesFocused(true);
        break;      
      }
  };

  const focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const saveCompany = async() => {
    Keyboard.dismiss();      
    setModalVisible(true);  
    const data = {afm: +afm, nameEnglish,  name, legalName};        
    try{
      if(edit){      //---------> Edit
        let updt = realm.objects('Company');
         
        realm.write(()=>{     
          updt[0].afm = afm;
          updt[0].nameEnglish = nameEnglish;
          updt[0].name = name;
          updt[0].legalName = legalName;
          updt[0].token = token;
          updt[0].doy = doy;
          updt[0].address = address;
          updt[0].phone = phone;
          updt[0].ypahes = ypahes;
        }) 
      } else{   //------------> Create
        realm.write(()=>{     
          realm.create('Company', data, false); //do not use primarykey 
        }) 
      } 
      closeModal();
    }catch (err){
      setModalVisible(false);
      setErrorModal(true);
    }
  };

  const closeModal = () => {    
    setModalVisible(false);    
    goBack();
  };

  const closeErrorModal = () => {    
    setErrorModal(false); 
  };

  const afmChange = p => {    
    setAfm(p);
  };

 
  return (  
      <SafeAreaView style={styles.screenContainer}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

      <KeyboardAvoidingView
        behavior={"height"}           
      >  
        <ScrollView> 

          <View style={styles.instructionContainer}>
            <Paragraph style={styles.instruction}>
              {"Add"}
            </Paragraph>
          </View>

          <View style={styles.form}>

            <View style={styles.inputContainer}>
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
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={nameElement}
                value={name}  
                onChangeText={onChangeText("name")}
                onFocus={onFocus("nameFocused")}
                inputFocused={nameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.name}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={afmElement}
                value={legalName}  
                onChangeText={onChangeText("afm")}
                onFocus={onFocus("afmFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>   

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>

            <View style={styles.inputContainer}>
              <UnderlineTextInput
                ref={legalNameElement}
                value={legalName}  
                onChangeText={onChangeText("legalName")}
                onFocus={onFocus("legalNameFocused")}
                inputFocused={legalNameFocused}
                onSubmitEditing={focusOn(afmElement)}
                returnKeyType="next"
                blurOnSubmit={false}
                placeholder={common.legalName}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                inputStyle={styles.inputStyle}
              />
            </View>


          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={saveUser}
              disabled={false}
              borderRadius={BUTTON_BORDER_RADIUS}
              small
              title={common.save}
            />
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
        <ActivityIndicatorModal
          message={common.wait}
          onRequestClose={closeModal}
          title={common.waitStorage}
          visible={modalVisible}
        />
        <ErrorModal
          cancelButton={closeErrorModal}
          errorText={common.otherName}
          visible={errorModal}
        />        
      </SafeAreaView>
    );
  
}

export default inject('feathersStore')(observer(AddUser));
