import React, { useState, useEffect, useCallback, useRef } from "react";
import { inject, observer } from "mobx-react";
import { 
  Modal,
  StyleSheet,
  View,
  KeyboardAvoidingView,  
  ScrollView,
  Text,
  Pressable
} from "react-native";
import Color from "color";
import UnderlineTextInput from "../../components/text/UnderlineTextInput";
import {Heading5} from "../../components/text/CustomText";
import Colors from "../../theme/colors";
import Icon from "../../components/Icon";
import Validators from '../../utils/validators';
import {Picker} from '@react-native-picker/picker';
import ActivityIndicatorModal from '../../components/modals/ActivityIndicatorModal'
import ErrorModal from '../../components/modals/ErrorModal'
import ContainedButton from "../../components/buttons/ContainedButton";
import { AppSchema } from "../../services/receipt-service"

// Translations
import _useTranslate from '../../hooks/_useTranslate';

const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const CLOSE_ICON = "close";

const ripple = {
  borderless: true,
}

const InvoiceDataModal = ({ feathersStore, visible, issueReceipt, cancelButton }) => {

  const afmElement = useRef(null);
  const legalNameElement = useRef(null);
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
  let aadeResponseRef = useRef(null);

  let common = _useTranslate(feathersStore.language);

  const [origins, setOrigins] = useState([]);  

  //------Form Controls-------
  const[afm, setAfm] = useState('');
  const[legalName, setLegalName] = useState(''); 
  const[doyDescription, setDoyDescription] = useState(''); 
  const[legalDescription, setLegalDescription] = useState('');
  const[firmActDescription, setFirmActDescription] = useState('');
  const[companyOrigin, setCompanyOrigin] = useState(1);
  const[postalAddress, setPostalAddress] = useState('');
  const[postalAddressNo, setPostalAddressNo] = useState('');  
  const[postalAreaDescription, setPostalAreaDescription] = useState('');
  const[postalZipCode, setPostalZipCode] = useState('');
  const[companyPhone, setCompanyPhone] = useState('');
  const[companyEmail, setCompanyEmail] = useState(''); 

  const[afmFocused, setAfmFocused] = useState(false);
  const[legalNameFocused, setLegalNameFocused] = useState(false); 
  const[doyDescriptionFocused, setDoyDescriptionFocused] = useState(false); 
  const[legalDescriptionFocused, setLegalDescriptionFocused] = useState(false);
  const[firmActDescriptionFocused, setFirmActDescriptionFocused] = useState(false);
  const[companyOriginFocused, setCompanyOriginFocused] = useState(false);
  const[postalAddressFocused, setPostalAddressFocused] = useState(false);
  const[postalAddressNoFocused, setPostalAddressNoFocused] = useState(false);  
  const[postalAreaDescriptionFocused, setPostalAreaDescriptionFocused] = useState(false);
  const[postalZipCodeFocused, setPostalZipCodeFocused] = useState(false);
  const[companyPhoneFocused, setCompanyPhoneFocused] = useState(false);
  const[companyEmailFocused, setCompanyEmailFocused] = useState(false);

  const[afmError, setAfmError] = useState(true);
  const[legalNameError, setLegalNameError] = useState(false); 
  const[doyDescriptionError, setDoyDescriptionError] = useState(false); 
  const[legalDescriptionError, setLegalDescriptionError] = useState(false);
  const[firmActDescriptionError, setFirmActDescriptionError] = useState(false);
  const[companyOriginError, setCompanyOriginError] = useState(false);
  const[postalAddressError, setPostalAddressError] = useState(false);
  const[postalAddressNoError, setPostalAddressNoError] = useState(false);  
  const[postalAreaDescriptionError, setPostalAreaDescriptionError] = useState(false);
  const[postalZipCodeError, setPostalZipCodeError] = useState(false);
  const[companyPhoneError, setCompanyPhoneError] = useState(false);
  const[companyEmailError, setCompanyEmailError] = useState(false);  

  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorText, setErrorText] = useState(false);
  
  
  useEffect(()=> { 
    setOrigins(AppSchema.origins);    
  },[feathersStore.isAuthenticated && feathersStore.settings]);
  

//-------------- Input control

  const afmChange = text => {  
    setAfm(text);
    afmValidation(text);
  };

  const doyDescriptionChange = text => {  
    setDoyDescription(text);
    doyDescriptionValidation(text);
  };

  const legalNameChange = text => {  
    setLegalName(text);
    legalNameValidation(text);
    
  };

  const legalDescriptionChange = text => {  
    setLegalDescription(text);
    legalDescriptionValidation(text);
  };

  const firmActDescriptionChange = text => {  
    setFirmActDescription(text);
    firmActDescriptionValidation(text);
  };

  const postalAddressChange = text => {  
    setPostalAddress(text);
    postalAddressValidation(text);
  };

  const postalAddressNoChange = text => {  
    setPostalAddressNo(text);
    postalAddressNoValidation(text);
  };
  
  const postalAreaDescriptionChange = text => {  
    setPostalAreaDescription(text);
    postalAreaDescriptionValidation(text);
  };

  const postalZipCodeChange = text => {  
    setPostalZipCode(text);
    postalZipCodeValidation(text);
  };

  const companyPhoneChange = text => {  
    setCompanyPhone(text);
    companyPhoneValidation(text);
  };

  const companyEmailChange = text => {    
    setCompanyEmail(text); 
    companyEmailValidation(text);   
  };

  //------------- Focus Control

  const afmFocus = () => {
    setAfmFocused(true)   
    setLegalNameFocused(false); 
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
  };

  const legalNameFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(true); 
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
  };

  const doyDescriptionFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(true); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const legalDescriptionFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(true);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const firmActDescriptionFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(true);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const companyOriginFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(true);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const postalAddressFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(true);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const postalAddressNoFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(true);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const postalAreaDescriptionFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(true);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const postalZipCodeFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(true);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(false); 
  };

  const companyPhoneFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(true);
    setCompanyEmailFocused(false); 
  };

  const companyEmailFocus = () => {
    setAfmFocused(false)   
    setLegalNameFocused(false); 
    setDoyDescriptionFocused(false); 
    setLegalDescriptionFocused(false);
    setFirmActDescriptionFocused(false);
    setCompanyOriginFocused(false);
    setPostalAddressFocused(false);
    setPostalAddressNoFocused(false);  
    setPostalAreaDescriptionFocused(false);
    setPostalZipCodeFocused(false);
    setCompanyPhoneFocused(false);
    setCompanyEmailFocused(true); 
  };


  const focusOn = nextField => () => {
    if (nextField) {
      nextField.current.focus();
    }
  };

  //Validation -----------------------------------------------------

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

  const legalNameValidation = val => {
    if (!Validators.validateNonEmpty(val) ) {
      setLegalNameError(true);
    }else{
      setLegalNameError(false);
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
  
  const printReceipt = async() => {
     
    feathersStore.setCompanyData({
      afm,
      legalName,
      legalDescription,
      doyDescription,
      firmActDescription,
      postalAddress,
      postalAddressNo,
      postalAreaDescription,
      postalZipCode,                                             
      companyPhone,
      companyEmail,
      companyOrigin      
    });
    await issueReceipt();
  }

  const search = async() => {  
    setIsLoading(true);
    try{
      aadeResponseRef.current = await feathersStore.createSoap(afm);      
      if(aadeResponseRef?.current?.postal_address){    
        const desc = aadeResponseRef.current.firm_act_tab?.item    
          .find((d)=> d.firm_act_kind[0] === '1')
        desc && setFirmActDescription(desc?.firm_act_descr[0]?.toString().trim());
        setLegalName(aadeResponseRef.current?.onomasia?.toString().trim());     
        setLegalDescription(aadeResponseRef.current?.legal_status_descr?.toString().trim());
        setDoyDescription(aadeResponseRef.current?.doy_descr?.toString().trim()); 
        setPostalAddress(aadeResponseRef.current?.postal_address?.toString().trim());
        setPostalAddressNo(aadeResponseRef.current?.postal_address_no?.toString().trim());
        setPostalAreaDescription(aadeResponseRef.current?.postal_area_description?.toString().trim());
        setPostalZipCode(aadeResponseRef.current?.postal_zip_code?.toString().trim());       
      } setIsLoading(false);
    }catch(error){
      console.log(error)
      setIsLoading(false);
    } 
  }
  
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
   
    
    <KeyboardAvoidingView
      behavior={"height"}
      style={styles.formContainer}  
      keyboardVerticalOffset = {0}  
    >
      <Heading5 style={styles.headerText}>{common.companyData}</Heading5>
      <View style={[styles.topButton, styles.right]}>
        <Pressable android_ripple={ripple} onPress={cancelButton}> 
          <View style={styles.buttonIconContainer}>
            <Icon
              name={CLOSE_ICON}
              size={22}
              color={Colors.white}
            />
          </View>
        </Pressable>
      </View>
      <ScrollView style={styles.form}>
        <UnderlineTextInput
          autoFocus={true}
          ref={afmElement}
          value={afm}
          onChangeText={afmChange}
          onFocus={afmFocus}
          inputFocused={afmFocused}
          onSubmitEditing={focusOn(legalNameElement)}
          placeholder={`${common.companyAfm}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
          showRightIcon={!afmError}
          rightIcon="search"
          rightIconPress={search}
          keyboardType='number-pad'
        />
        <View style={styles.errorContainer}>
          {afmError && <Text style={styles.errorText}>{common.afmError}</Text>}
        </View>
        <UnderlineTextInput
          ref={legalNameElement}
          value={legalName}
          onChangeText={legalNameChange}
          onFocus={legalNameFocus}
          inputFocused={legalNameFocused}
          onSubmitEditing={focusOn(doyDescriptionElement)}
          placeholder={`${common.legalName}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}          
        />
        <View style={styles.errorContainer}>
          {legalNameError && <Text style={styles.errorText}>{common.legalNameError}</Text>}
        </View>
        <UnderlineTextInput
          ref={doyDescriptionElement}
          value={doyDescription}
          onChangeText={doyDescriptionChange}
          onFocus={doyDescriptionFocus}
          inputFocused={doyDescriptionFocused}
          onSubmitEditing={focusOn(legalDescriptionElement)}
          placeholder={`${common.doyDescription}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {doyDescriptionError && <Text style={styles.errorText}>{common.doyDescriptionError}</Text>}
        </View>

        <UnderlineTextInput
          ref={legalDescriptionElement}
          value={legalDescription}
          onChangeText={legalDescriptionChange}
          onFocus={legalDescriptionFocus}
          inputFocused={legalDescriptionFocused}
          onSubmitEditing={focusOn(firmActDescriptionElement)}
          placeholder={`${common.legalDescription}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {legalDescriptionError && <Text style={styles.errorText}>{common.legalDescriptionError}</Text>}
        </View>

        <UnderlineTextInput
          ref={firmActDescriptionElement}
          value={firmActDescription}
          onChangeText={firmActDescriptionChange}
          onFocus={firmActDescriptionFocus}
          inputFocused={firmActDescriptionFocused}
          onSubmitEditing={focusOn(postalAddressElement)}
          placeholder={`${common.firmActDescription}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
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
          onChangeText={postalAddressChange}
          onFocus={postalAddressFocus}
          inputFocused={postalAddressFocused}
          onSubmitEditing={focusOn(postalAddressNoElement)}
          placeholder={`${common.postalAddress}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAddressError && <Text style={styles.errorText}>{common.streetError}</Text>}
        </View>

        <UnderlineTextInput
          ref={postalAddressNoElement}
          value={postalAddressNo}
          onChangeText={postalAddressNoChange}
          onFocus={postalAddressNoFocus}
          inputFocused={postalAddressNoFocused}
          onSubmitEditing={focusOn(postalAreaDescriptionElement)}
          placeholder={`${common.postalAddressNo}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAddressNoError && <Text style={styles.errorText}>{common.streetNumberError}</Text>}
        </View>

        <UnderlineTextInput
          ref={postalAreaDescriptionElement}
          value={postalAreaDescription}
          onChangeText={postalAreaDescriptionChange}
          onFocus={postalAreaDescriptionFocus}
          inputFocused={postalAreaDescriptionFocused}
          onSubmitEditing={focusOn(postalZipCodeElement)}
          placeholder={`${common.postalAreaDescription}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalAreaDescriptionError && <Text style={styles.errorText}>{common.cityError}</Text>}
        </View>

        <UnderlineTextInput
          ref={postalZipCodeElement}
          value={postalZipCode}
          onChangeText={postalZipCodeChange}
          onFocus={postalZipCodeFocus}
          inputFocused={postalZipCodeFocused}
          onSubmitEditing={focusOn(companyEmailElement)}
          placeholder={`${common.postalZipCode}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {postalZipCodeError && <Text style={styles.errorText}>{common.postcodeError}</Text>}
        </View>

        <UnderlineTextInput
          ref={companyEmailElement}
          value={companyEmail}
          onChangeText={companyEmailChange}
          onFocus={companyEmailFocus}
          inputFocused={companyEmailFocused}
          onSubmitEditing={focusOn(companyPhoneElement)}
          placeholder={`${common.companyEmail}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {companyEmailError && <Text style={styles.errorText}>{common.emailError}</Text>}
         </View>

        <UnderlineTextInput
          ref={companyPhoneElement}
          value={companyPhone}
          onChangeText={companyPhoneChange}
          onFocus={companyPhoneFocus}
          inputFocused={companyPhoneFocused}  
          placeholder={`${common.companyPhone}*`}
          returnKeyType="next"
          focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
          inputContainerStyle={styles.inputContainerStyle}
          editable={true}
        />
        <View style={styles.errorContainer}>
          {companyPhoneError && <Text style={styles.errorText}>{common.phoneError}</Text>}
        </View>     
    
        <View style={styles.vSpacer}></View> 
          <View style={styles.saveButton}>                       
            <ContainedButton
              onPress={printReceipt}
              color={Colors.primaryColor}
              socialIconName="check"
              iconColor={Colors.onPrimaryColor} 
              title={common.print}
              titleColor={Colors.onPrimaryColor} 
              titleStyle={styles.buttonTitle} 
              disabled={
                !afm || afmError ||
                !legalName || legalNameError ||
                !doyDescription || doyDescriptionError ||
                !legalDescription || legalDescriptionError ||
                !firmActDescription || firmActDescriptionError ||
                !postalAddress || postalAddressError ||
                !postalAddressNo || postalAddressNoError ||
                !postalAreaDescription || postalAreaDescriptionError ||
                !postalZipCode || postalZipCodeError ||
                !companyPhone || companyPhoneError
                }
            /> 
          </View>
      </ScrollView>
     
      <ActivityIndicatorModal
        message={common.wait}
        onRequestClose={() => setIsLoading(false)}
        title={common.waitCompany}
        visible={isLoading}
        isTablet={feathersStore.isTablet}
      />
      <ErrorModal
        cancelButton={() => setErrorModal(false)}
        errorText={errorText}
        cancelText={common.cancel}
        visible={errorModal}
        isTablet={feathersStore.isTablet}
      />  
    </KeyboardAvoidingView>   
    </Modal>
  );

}

const styles = StyleSheet.create({  
  formContainer: {
    flex: 1,      
    backgroundColor: Colors.background,
    justifyContent: "space-between", 
  },
  form: {       
    paddingHorizontal: 20
  },
  overline: {
    color: Color(Colors.secondaryText).alpha(0.6).string()
    //color: `rgba(${Colors.secondaryText}, 0.6)`
  },
  inputContainerStyle: {
    marginTop: 0,
    paddingVertical: 0,
    paddingHorizontal: 0
  },
  actionButton: {
    color: Colors.accentColor,
    textAlign: "center"
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
  footerButton: {
    color: Colors.accentColor,  
  },
  appleIdButton: {
    width: "100%"
  }, 
  buttonTitle: {
    paddingHorizontal: 0,
    fontSize: 15,
    fontWeight: "700"
  },
  vSpacer: {
    height: 25
  }, 
  topButton: {
    position: "absolute",
    top: 16,
    borderRadius: 18,
    backgroundColor: Colors.googleButton,
    borderWidth: 2,
    borderColor: Colors.white
  },
  buttonIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  right: { right: 16 },
  headerText: {
    marginVertical: 16,
   textAlign: "center"
  }
});

export default inject('feathersStore')(observer(InvoiceDataModal));