/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React, { useState, useEffect, useRef } from "react";
import { Keyboard, StatusBar, StyleSheet, View, SafeAreaView,
  KeyboardAvoidingView, ScrollView, Text} from "react-native";
import {Picker} from '@react-native-picker/picker';
import ActivityIndicatorModal from "../../components/modals/ActivityIndicatorModal";
import ErrorModal from "../../components/modals/ErrorModal";
import ContainedButton from "../../components/buttons/ContainedButton";
import { Caption, Paragraph, Subtitle1, Subtitle2 } from "../../components/text/CustomText";
import UnderlineTextInput from "../../components/text/UnderlineTextInput";
import Validators from '../../utils/validators';

import Colors from "../../theme/colors";

import { inject, observer } from "mobx-react";

import _useTranslate from '../../hooks/_useTranslate';

import {useRealm} from '@realm/react';

const PLACEHOLDER_TEXT_COLOR = "rgba(0, 0, 0, 0.4)";
const INPUT_TEXT_COLOR = "rgba(0, 0, 0, 0.87)";
const INPUT_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";
const INPUT_FOCUSED_BORDER_COLOR = "#000";
const BUTTON_BORDER_RADIUS = 4;

const AddUser = ({route, navigation, feathersStore }) => {

  const rolesArray = [{
    "id" : 1,
    "label" : "Ταμείας 1",
    "role": "cashier"
  }, {
    "id" : 2,
    "label" : "Ταμείας 2",
    "role": "cashier"
  }, {
    "id" : 3,
    "label" : "Ταμείας 3",
    "role": "cashier"
  }, {
    "id" : 4,
    "label" : "Ταμείας 4",
    "role": "cashier"
  }, {
    "id" : 5,
    "label" : "Ταμείας 5",
    "role": "cashier"
  }, {
    "id" : 6,
    "label" : "Διαχειριστής",
    "role": "admin"
  }];

  let common = _useTranslate(feathersStore.language);

  const realm = useRealm();
   
  const [name, setName] = useState("");  
  const [nameFocused, setNameFocused] = useState(false);   
  const [nameEnglish, setNameEnglish] = useState("");   
  const [nameEnglishFocused, setNameEnglishFocused] = useState(false);   
  const [password, setPassword] = useState("");    
  const [passwordFocused, setPasswordFocused] = useState(false);   
  const [role, setRole] = useState(1);    
  const [roleFocused, setRoleFocused] = useState(false);    
  const [modalVisible, setModalVisible] = useState(false);    
  const [errorModal, setErrorModal] = useState(false) ;   
  const [pickerRolesArray, setPickerRolesArray] = useState([]);  
  const [editable, setEditable] = useState(false) ;

  const nameEnglishElement = useRef(null);
  const nameElement = useRef(null);
  const roleElement = useRef(null);
  const passwordElement = useRef(null);
  const paramIndex = useRef(null);

  const[nameError, setNameError] = useState(false); 
  const[nameEnglishError, setNameEnglishError] = useState(false); 
  const[passwordError, setPasswordError] = useState(false); 

  useEffect(() => {    
    const {title} = route.params;
    navigation.setOptions({ title });
   if(route.params?.index >= 0) {
      paramIndex.current = route.params.index; 
      setEditable(false);
      route.params?.item && loadUser();
    }else{
      setEditable(true);
      paramIndex.current = null;
    } 
  }, [route.params]);

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      keyboardDidHide
    );
    return () =>{
      keyboardDidHideListener.remove();
    }  
  },  []);

  useEffect(() => {
    setPickerRolesArray(rolesArray);
  },  [feathersStore?.isAuthenticated]);

 const loadUser = () => {   
    const userToEdit = JSON.parse(route.params?.item); 
    if (userToEdit){
      setNameEnglish(userToEdit.nameEnglish);
      setName(userToEdit.name);
      setRole(userToEdit.role);
      setPassword(userToEdit.password);
    };   
  }

  const keyboardDidHide = () => {    
      setNameFocused(false);
      setNameEnglishFocused(false);
      setPasswordFocused(false);
      setRoleFocused(false);  
  }

  const goBack = () => {   
    navigation.goBack();
  };
  
  const onChangeText = key => (text) => {
    switch(key){
      case "nameEnglish" : { 
        setNameEnglish(text);
        nameEnglishValidation(text);
      };
      break;
      case "name" : {
        setName(text);
        nameValidation(text);
      };
      break;
      case "password" :  {
        setPassword(text);
        passwordValidation(text);
      };
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
        case "roleFocused" : setRoleFocused(true);
        break;
        case "passwordFocused" : setPasswordFocused(true);
        break;        
      }
  };

  const focusOn = nextField => () => {
    if (nextField) {
      nextField.focus();
    }
  };

  const nameValidation = val => {
    if (!Validators.validateNonEmpty(val) ) {
      setNameError(true);
    }else{
      setNameError(false);
    }   
  }
  
  const nameEnglishValidation = val => {
    if (!Validators.validateNonEmpty(val) ) {
      setNameEnglishError(true);
    }else{
      setNameEnglishError(false);
    }   
  }  
  
  const passwordValidation = val => {
    if (!Validators.validateNonEmpty(val) ) {
      setPasswordError(true);
    }else{
      setPasswordError(false);
    }   
  }

  const saveUser = async() => {
    Keyboard.dismiss();      
    setModalVisible(true);  
    const data = {role: +role, nameEnglish,  name, password};   
    try{
      if(paramIndex?.current && (+paramIndex?.current >= 0)){      //---------> Edit
        let updt = realm.objects('User');
         
        realm.write(()=>{     
          updt[+paramIndex.current].role = +role;
          updt[+paramIndex.current].nameEnglish = nameEnglish;
     //     updt[0].name = name;
          updt[+paramIndex.current].password = password;
        }) 
      } else{   //------------> Create
        realm.write(()=>{     
          realm.create('User', data); 
        }) 
      } 
      closeModal();
    }catch (err){
      setModalVisible(false);
      console.log(err)
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

  const roleChange = p => {    
    setRole(p);
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
            ref={nameElement}
            value={name}  
            onChangeText={onChangeText("name")}
            onFocus={onFocus("nameFocused")}
            inputFocused={nameFocused}
            onSubmitEditing={focusOn(nameEnglishElement.current)}
            returnKeyType="next"
            blurOnSubmit={false}
            placeholder={common.username}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            inputTextColor={INPUT_TEXT_COLOR}
            borderColor={INPUT_BORDER_COLOR}
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            inputStyle={styles.inputStyle}
            editable={editable}
          />
          <View style={styles.errorContainer}>
            {nameError && <Text style={styles.errorText}>{common.nameError}</Text>}
          </View>

          <UnderlineTextInput
            ref={nameEnglishElement}
            value={nameEnglish}                
            onChangeText={onChangeText("nameEnglish")}
            onFocus={onFocus("nameEnglishFocused")}
            inputFocused={nameEnglishFocused}
            onSubmitEditing={focusOn(passwordElement.current)}
            returnKeyType="next"
            blurOnSubmit={false}
            placeholder={common.usernameEnglish}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            inputTextColor={INPUT_TEXT_COLOR}
            borderColor={INPUT_BORDER_COLOR}
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            inputStyle={styles.inputStyle}
          />
          <View style={styles.errorContainer}>
              {nameEnglishError && <Text style={styles.errorText}>{common.nameEnglishError}</Text>}
          </View>

          <UnderlineTextInput
            ref={passwordElement}
            value={password}  
            onChangeText={onChangeText("password")}
            onFocus={onFocus("passwordFocused")}
            inputFocused={passwordFocused}
            onSubmitEditing={focusOn(roleElement.current)}
            returnKeyType="next"
            blurOnSubmit={false}
            placeholder={"Password"}
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            inputTextColor={INPUT_TEXT_COLOR}
            borderColor={INPUT_BORDER_COLOR}
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            inputStyle={styles.inputStyle}
          />
          <View style={styles.errorContainer}>
            {passwordError && <Text style={styles.errorText}>{common.passwordError}</Text>}
          </View>

          <View style={[styles.row, styles.inputContainerStyle]}>      
            <Subtitle2 style={[styles.small,  styles.cityTitle]}>{common.role}</Subtitle2>
            <Picker
              style={[ styles.picker]}
              ref={roleElement}
              onFocus={onFocus("roleFocused")}
              inputFocused={roleFocused}
              selectedValue={role}
              mode={'dropdown'}
              onValueChange={(itemValue, itemIndex) =>
              roleChange(itemValue)
            }>
            {pickerRolesArray?.map((i, index)=> (              
              <Picker.Item key={index}  color={Colors.primaryText} label={i.label} value={i.id}/>
            ))}        
            </Picker>
          </View> 
          <View style={styles.vSpacer}></View> 
          <View style={styles.saveButton}>                       
            <ContainedButton
              onPress={saveUser}
              color={Colors.primaryColor}
              socialIconName="check"
              iconColor={Colors.onPrimaryColor} 
              title={common.save}
              titleColor={Colors.onPrimaryColor} 
              titleStyle={styles.buttonTitle} 
              disabled={!name || nameError || !nameEnglish || nameEnglishError}
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
    width: 204
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
  errorContainer: { height: 14},
  errorText: {
    color: Colors.error,
    fontSize: 12, 
    marginBottom: -12    
  },
  buttonTitle: {
    paddingHorizontal: 0,
    fontSize: 15,
    fontWeight: "700"
  },
  vSpacer: {
    height: 25
  },  
  formContainer: {
    flex: 1,      
    backgroundColor: Colors.background,
    justifyContent: "space-between", 
  },
});

export default inject('feathersStore')(observer(AddUser));
