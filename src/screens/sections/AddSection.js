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
import { Caption, Paragraph,   Subtitle1, Subtitle2 } from "../../components/text/CustomText";
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

// AddSectionA Styles
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
let vatElement;
let colorElement;

// AddSectionA
const AddSection = ({route, navigation, feathersStore }) => {

  const vatsArray = [{
    "id" : 1,
    "label" : 24
  }, {
    "id" : 2,
    "label" : 13
  }, {
    "id" : 3,
    "label" : 6
  }, {
    "id" : 4,
    "label" : 17
  }, {
    "id" : 5,
    "label" : 9
  }, {
    "id" : 6,
    "label" : 4
  }, {
    "id" : 7,
    "label" : 0
  }]

  const colorsArray = [{
    "id" : "blue",
    "value" : Colors.primaryColor
  }, {
    "id" : "turquize",
    "value" : Colors.accentColor
  }, {
    "id" : "red",
    "value" : Colors.tertiaryColor
  }, {
    "id" : "light yellow",
    "value" : Colors.overlayColor
  }, {
    "id" : "orange",
    "value" : Colors.selection
  }, {
    "id" : "black",
    "value" : Colors.black
  }, {
    "id" : "dark blue",
    "value" : Colors.primaryColorDark
  }]

  let common = _useTranslate(feathersStore.language);

  const realm = useRealm();
   
  const [name, setName] = useState("");  
  const [nameFocused, setNameFocused] = useState(false);   
  const [nameEnglish, setNameEnglish] = useState("");   
  const [nameEnglishFocused, setNameEnglishFocused] = useState(false);   
  const [color, setColor] = useState("");    
  const [colorFocused, setColorFocused] = useState(false);   
  const [vat, setVat] = useState("");    
  const [vatFocused, setVatFocused] = useState(false);    
  const [modalVisible, setModalVisible] = useState(false);    
  const [index, setIndex] = useState('');  
  const [errorModal, setErrorModal] = useState(false) ;   
  const [pickerColorsArray, setPickerColorsArray] = useState([]);
  const [pickerVatsArray, setPickerVatsArray] = useState([]);  

  useEffect(() => {    
    const {title} = route.params;
    navigation.setOptions({ title });
    if(route.params?.index) setIndex(route.params.index);
    route.params?.item && loadSection();
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
    setPickerColorsArray(colorsArray);  
    setPickerVatsArray(vatsArray);
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
      case "nameEnglish" : setNameEnglish(text);
      break;
      case "name" : setName(text);
      break;
    }
  };

  const onFocus = key => () => {    
      setNameFocused(false);
      setNameEnglishFocused(false);
      setColorFocused(false);
      setVatFocused(false);
   
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

  const saveSection = async() => {
    Keyboard.dismiss();      
    setModalVisible(true);  
    const data = {vat: +vat, nameEnglish,  name, color};        
    try{
      if(index){      //---------> Edit
        let updt = realm.objects('Profile');
         
        realm.write(()=>{     
          updt[0].vat = +vat;
          updt[0].nameEnglish = nameEnglish;
          updt[0].name = name;
          updt[0].color = color;
        }) 
      } else{   //------------> Create
        realm.write(()=>{     
          realm.create('Section', data, false); //do not use primarykey 
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
        behavior={Platform.OS === "ios" ? "padding" : "height"}           
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
                onSubmitEditing={focusOn(vatElement)}
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

            <View style={[styles.row, styles.inputContainerStyle]}>      
              <Subtitle2 style={[styles.small,  styles.cityTitle]}>{common.partyOf}</Subtitle2>
              <Picker
                style={[ styles.picker]}
                ref={vatElement}
                onFocus={onFocus("vatFocused")}
                inputFocused={vatFocused}
                selectedValue={+vat}
                mode={'dropdown'}
                onValueChange={(itemValue, itemIndex) =>
                vatChange(itemValue)
              }>
              {pickerVatsArray?.map((i, index)=> (              
                <Picker.Item key={index}  color={Colors.primaryText} label={i.label} value={i.id}/>
              ))}        
              </Picker>
              <Subtitle1 style={[styles.small,  styles.numberTitle]}>{vat}</Subtitle1>
            </View>

            <View style={[styles.row, styles.inputContainerStyle]}>      
              <Subtitle2 style={[styles.small,  styles.cityTitle]}>{common.partyOf}</Subtitle2>
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
              <Subtitle1 style={[styles.small,  styles.numberTitle]}>{color}</Subtitle1>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              onPress={saveSection}
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

export default inject('feathersStore')(observer(AddSection));
