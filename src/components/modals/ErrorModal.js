/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from "react";
import { 
  Modal,
  StyleSheet,
  Text,  
  View
} from "react-native";

import Colors from "../../theme/colors";
import ContainedButton from "../../components/buttons/ContainedButton";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,    
    width: "80%",
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
  }
});


const ErrorModal = ({  
  cancelButton,
  errorText,
  cancelText = "ΣΥΝΕΧΕΙΑ",
  visible = false
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>       
        <Text style={styles.textStyle}>{errorText}</Text>       
        <ContainedButton
          color={Colors.googleButton}
          onPress={cancelButton}
          height={34}
          width="100%"
          title={cancelText}
          titleStyle={styles.buttonTitle}
          borderWidth={2}
          borderColor={Colors.onPrimaryColor}     
        />
      </View>
    </View>
  </Modal>
);

export default ErrorModal;
