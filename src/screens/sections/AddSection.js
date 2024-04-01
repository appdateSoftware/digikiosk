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
import { Caption, Paragraph,   Subtitle1, Subtitle2 } from "../../components/text/CustomText";
import UnderlineTextInput from "../../components/text/UnderlineTextInput";
import Validators from '../../utils/validators';
import { AppSchema } from "../../services/receipt-service";

import Colors from "../../theme/colors";

import { inject, observer } from "mobx-react";

import _useTranslate from '../../hooks/_useTranslate';

import {useRealm, useQuery} from '@realm/react';

const PLACEHOLDER_TEXT_COLOR = "rgba(0, 0, 0, 0.4)";
const INPUT_TEXT_COLOR = "rgba(0, 0, 0, 0.87)";
const INPUT_BORDER_COLOR = "rgba(0, 0, 0, 0.2)";
const INPUT_FOCUSED_BORDER_COLOR = "#000";
const BUTTON_BORDER_RADIUS = 4;


const AddSection = ({route, navigation, feathersStore }) => {   

  let common = _useTranslate(feathersStore.language);

  const realm = useRealm();
  const realm_sections = useQuery('Section');
   
  const [name, setName] = useState("");  
  const [nameFocused, setNameFocused] = useState(false);   
  const [nameEnglish, setNameEnglish] = useState("");   
  const [nameEnglishFocused, setNameEnglishFocused] = useState(false);   
  const [color, setColor] = useState("");    
  const [colorFocused, setColorFocused] = useState(false);   
  const [vat, setVat] = useState(1);    
  const [vatFocused, setVatFocused] = useState(false);    
  const [modalVisible, setModalVisible] = useState(false);    
  const [errorModal, setErrorModal] = useState(false) ;   
  const [pickerColorsArray, setPickerColorsArray] = useState([]);
  const [pickerVatsArray, setPickerVatsArray] = useState([]);
  const [editable, setEditable] = useState(false) ;

  const[nameError, setNameError] = useState(false); 
  const[nameEnglishError, setNameEnglishError] = useState(false); 
  
  const nameEnglishElement = useRef(null);
  const nameElement = useRef(null);
  const vatElement = useRef(null);
  const colorElement = useRef(null);
  const paramIndex = useRef(null);

  useEffect(() => {    
    const {title} = route.params;
    navigation.setOptions({ title });
    if(route.params?.index >= 0) {
      paramIndex.current = route.params.index; 
      setEditable(false);
      route.params?.item && loadSection();
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
    setPickerColorsArray(AppSchema.colorsArray);  
    setPickerVatsArray(AppSchema.vatsArray);
  },  [feathersStore?.isAuthenticated]);

 const loadSection = () => {   
    const sectionToEdit = JSON.parse(route.params?.item); 
    if (sectionToEdit){
      setNameEnglish(sectionToEdit.nameEnglish);
      setName(sectionToEdit.name);
      setVat(sectionToEdit.vat);
      setColor(sectionToEdit.color);
    };   
  }

  const keyboardDidHide = () => {    
      setNameFocused(false);
      setNameEnglishFocused(false);
      setColorFocused(false);
      setVatFocused(false);  
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
      case "name" : {
        setName(text);
        nameValidation(text);
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
        case "vatFocused" : setVatFocused(true);
        break;
        case "colorFocused" : setColorFocused(true);
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

  const saveSection = async() => {
    Keyboard.dismiss();      
    console.log(paramIndex?.current)
    setModalVisible(true);  
    const data = {vat: vat, nameEnglish,  name, color};        
    try{
      if(paramIndex?.current !== null && paramIndex?.current > -1){     //---------> Edit
        realm.write(()=>{     
          realm_sections[+paramIndex.current].vat = vat;
          realm_sections[+paramIndex.current].nameEnglish = nameEnglish;
          realm_sections[+paramIndex.current].color = color;
        }) 
      } else{   //------------> Create
        realm.write(()=>{     
          realm.create('Section', data);
        }) 
      } 
      closeModal();
    }catch (err){
      console.log(err)
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

  const vatChange = p => {    
    setVat(p);
  };

  const colorChange = p => {    
    setColor(p);
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
              placeholder={common.name}
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
              onSubmitEditing={focusOn(vatElement.current)}
              returnKeyType="next"
              blurOnSubmit={false}
              placeholder={common.nameEnglish}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputStyle={styles.inputStyle}
            />
              <View style={styles.errorContainer}>
                {nameEnglishError && <Text style={styles.errorText}>{common.nameEnglishError}</Text>}
            </View>

            <View style={[styles.row, styles.inputContainerStyle]}>      
              <Subtitle2 style={[styles.small,  styles.cityTitle]}>{common.vat}</Subtitle2>
              <Picker
                style={[ styles.picker]}
                ref={vatElement}
                onFocus={onFocus("vatFocused")}
                inputFocused={vatFocused}
                selectedValue={vat}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                vatChange(itemValue)
              }>
              {pickerVatsArray?.map((i, index)=> (              
                <Picker.Item key={index}  color={Colors.primaryText} label={i.label} value={i.id}/>
              ))}        
              </Picker>              
            </View>

            <View style={[styles.row, styles.inputContainerStyle]}>      
              <Subtitle2 style={[styles.small,  styles.cityTitle]}>{common.color}</Subtitle2>
              <Picker
                style={[ styles.picker]}
                ref={colorElement}
                onFocus={onFocus("colorFocused")}
                inputFocused={colorFocused}
                selectedValue={color}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                colorChange(itemValue)
              }>
              {pickerColorsArray?.map((i, index)=> (              
                <Picker.Item key={index}  color={i.value} label={i.id} value={i.id}/>
              ))}        
              </Picker>             
            </View>
         

            <View style={styles.vSpacer}></View> 
            <View style={styles.saveButton}>                       
              <ContainedButton
                onPress={saveSection}
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
    padding: 12,
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

export default inject('feathersStore')(observer(AddSection));
