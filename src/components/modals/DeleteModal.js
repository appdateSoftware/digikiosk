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
  TouchableHighlight,  
  StyleSheet,
  Text,  
  View
} from "react-native";

import Colors from "../../theme/colors";

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


const DeleteModal = ({
  deleteButton,
  cancelButton,
  cancelText = "Ακύρωση",
  visible = false
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Είστε σίγουροι για τη διαγραφή?</Text>
        <TouchableHighlight
          style={{ ...styles.openButton, backgroundColor: Colors.tertiaryColorDark }}
          onPress={deleteButton}
        >
        <Text style={styles.textStyle}>Διαγραφή</Text>
        </TouchableHighlight>
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

export default DeleteModal;
