/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useEffect, useState} from "react";
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
  }
});


const ChangeUserModal = ({
  titleText = "Αλλαγή χρήστη",
  cancelButton,
  cancelText = "Ακύρωση",  
  visible = false,
  feathersStore
}) =>{

  const realm = useRealm();
  const realm_users = useQuery('User');

  const [user, setUser] = useState({})

  useEffect(() => {
    setUser(feathersStore.user.name)
  }, [])

  const userChange = p => {    
    setUser(p);
    const ind = realm_users.findIndex(u => u.name === p);
    realm.write(()=>{     
      for (let i = 0, len = realm_users.length; i < len; i++) {
        realm_users[i].active = false; 
      }
    })
    realm.write(()=>{     
      realm_users[+ind].active = true;     
    }) 
    feathersStore.setUser(realm_users[+ind])
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
          <TouchableHighlight
            style={{ ...styles.openButton }}
            onPress={cancelButton}
          >
            <Text style={styles.textStyle}>{cancelText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
}

export default inject('feathersStore')(observer(ChangeUserModal));
