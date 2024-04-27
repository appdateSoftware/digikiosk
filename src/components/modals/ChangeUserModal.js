/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useEffect, useState, useRef} from "react";
import { 
  Modal,
  TouchableHighlight,  
  StyleSheet,
  Text,  
  View,  
} from "react-native";

import Colors from "../../theme/colors";
import {useRealm, useQuery} from '@realm/react';
import {Picker} from '@react-native-picker/picker';
import { inject, observer } from "mobx-react";
import UnderlinePasswordInput from "../text/UnderlinePasswordInput";



const PLACEHOLDER_TEXT_COLOR = Colors.stateGrey;
const INPUT_TEXT_COLOR = Colors.black;
const INPUT_BORDER_COLOR =  Colors.stateGrey;
const INPUT_FOCUSED_BORDER_COLOR = Colors.black;


const ChangeUserModal = ({
  titleText = "Αλλαγή χρήστη",
  cancelButton,
  cancelText = "Ακύρωση",  
  saveText = "Αλλαγή",
  visible = false,
  passwordErrorMatch,
  feathersStore
}) =>{

  const realm = useRealm();
  const realm_users = useQuery('User');

  const passwordRef = useRef(null);

  const [user, setUser] = useState({});
  const[ password, setPassword] = useState("");
  const[ passwordFocused, setPasswordFocused] = useState(false);  
  const[ secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorText, setPasswordErrorText] = useState(false);

  useEffect(() => {
    setUser(feathersStore.user.name)
  }, []);

  useEffect(() => {
    setPasswordErrorText(passwordErrorMatch)
  }, [passwordErrorMatch]);

  const userChange = p => {      
    setUser(p);
    passwordRef.current.focus();
  }

  const passwordChange = text => { 
    setPassword(text);    
  };

  const onTogglePress = () => {    
    setSecureTextEntry(!secureTextEntry);   
  };

  const save = () => {  
    const usr = realm_users.find(u => u.name === user);  
    if(usr.password.trim() === password.trim() ){
      const ind = realm_users.findIndex(u => u.name === user);
      realm.write(()=>{     
        for (let i = 0, len = realm_users.length; i < len; i++) {
          if(+i !== +ind){
            realm_users[+i].active = false; 
          }else { 
            realm_users[+ind].active = true;  
          }
        }
      })    
      setPasswordError(false);
      feathersStore.setUser(realm_users[+ind]);
      cancelButton();
    }else{
      setPasswordError(true)
    }    
  };

  return(
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}       
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{titleText}</Text>
          <Picker
            style={[ styles.picker]}
            selectedValue={user}
            mode={'dropdown'}
            onValueChange={(itemValue, itemIndex) =>
            userChange(itemValue)
          }>
          {realm_users?.map((i, index)=> (              
            <Picker.Item key={index}  color={Colors.primaryText} label={i.name} value={i.name}/>
          ))}        
          </Picker>       
          <UnderlinePasswordInput
            ref={passwordRef}
            onChangeText={passwordChange}
            inputFocused={passwordFocused}
            onSubmitEditing={save}
            returnKeyType="go"
            placeholder="Password*"
            placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
            inputTextColor={INPUT_TEXT_COLOR}
            secureTextEntry={secureTextEntry}
            borderColor={INPUT_BORDER_COLOR}
            focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
            toggleVisible={password.length > 0}
            toggleText={secureTextEntry ? "Show" : "Hide"}
            onTogglePress={onTogglePress}
            iconName="lock"
          />
          <View style={passwordError ? styles.passwordErrorContainer : styles.errorContainer}>
            {passwordError && <Text style={styles.errorText}>{passwordErrorText}</Text>}
          </View>    
          <View style={styles.buttonRow}> 
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={save}
            >
              <Text style={styles.textStyle}>{saveText}</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={{ ...styles.openButton }}
              onPress={cancelButton}
            >
            <Text style={styles.textStyle}>{cancelText}</Text>
            </TouchableHighlight>
          </View>
        
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.tertiaryColor,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    margin: 10,
    backgroundColor: Colors.primaryColor, 
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: Colors.onPrimaryColor,
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    color: Colors.onPrimaryColor,
    marginBottom: 15,
    textAlign: "center"
  },
  errorText: {
    color: Colors.onPrimaryColor,
    fontSize: 12, 
    marginBottom: -12    
  },
  errorContainer: { height: 14},
  passwordErrorContainer: { height: 28},
  buttonRow: {
    flexDirection: "row",
    marginVertical: 8,
    width: "80%",
    justifyContent: "space-between"
  },
  picker: {
    justifyContent: "center",
    alignItems: "center",
    width: 204
  },
});

export default inject('feathersStore')(observer(ChangeUserModal));
