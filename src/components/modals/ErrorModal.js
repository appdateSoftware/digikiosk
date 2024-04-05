/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useEffect, useState}from "react";
import { 
  Modal,
  StyleSheet,
  Text,  
  View, 
} from "react-native";

import Colors from "../../theme/colors";
import ContainedButton from "../../components/buttons/ContainedButton";
import Clipboard from '@react-native-clipboard/clipboard';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,    
    width: "90%",
    backgroundColor: Colors.selection,
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 55,
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
  separator: {
    height: 20
  },
  buttonTitle: {
    fontSize: 12,
    fontWeight: "900"
  },
  textStyle: {
    color: Colors.onSecondaryColor,    
    textAlign: "center",
    marginBottom: 16
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-around"
  }
});


const ErrorModal = ({  
  cancelButton,
  errorText,
  cancelText = "ΣΥΝΕΧΕΙΑ",
  visible = false,
  uniqueId,
  uniqueIdText
}) => {

  const [deviceId, setDeviceId] = useState("")

  useEffect(() => {
    setDeviceId(uniqueId)
  }, [uniqueId])

  const copyUniqueId = () => {
    Clipboard.setString(uniqueId);
  }
  
  return (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>       
        <Text style={styles.textStyle}>{errorText}</Text>
        <View style={styles.buttonsContainer}>        
          <ContainedButton
            color={Colors.googleButton}
            onPress={cancelButton}
            height={34}
            width="40%"
            title={cancelText}
            titleStyle={styles.buttonTitle}
            borderWidth={2}
            borderColor={Colors.onPrimaryColor}     
          />
          {deviceId &&
            <ContainedButton
              color={Colors.primaryColor}
              onPress={copyUniqueId}
              height={34}
              width="40%"
              title={uniqueIdText}
              titleStyle={styles.buttonTitle}
              borderWidth={2}
              borderColor={Colors.onPrimaryColor}     
            />
          }
        </View> 
      </View>      
    </View>
  </Modal>
)};

export default ErrorModal;
