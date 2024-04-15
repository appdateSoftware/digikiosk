/**
 * Digi Kiosk - React Native Template
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
import { inject, observer } from "mobx-react";
import _useTranslate from '../../hooks/_useTranslate';

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.secondaryColor,
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
    marginBottom: 15,
    textAlign: "center"
  }
});


const CancelItemModal = ({
  deleteButton,
  cancelButton,
  visible = false,
  feathersStore
}) => {

  let common = _useTranslate(feathersStore.language);
  
  return(
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <TouchableHighlight
          style={[{ ...styles.openButton, backgroundColor: Colors.tertiaryColor}, feathersStore.isTablet && {paddingHorizontal: 32}]}
          onPress={deleteButton}
        >
          <Text style={[styles.textStyle, feathersStore.isTablet && {fontSize: 24}]}>
            {common.cancelItem}</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[{ ...styles.openButton } ,feathersStore.isTablet && {paddingHorizontal: 32}]}
          onPress={cancelButton}
        >
          <Text style={[styles.textStyle, feathersStore.isTablet && {fontSize: 24}]}>{common.cancelSmall}</Text>
        </TouchableHighlight>
      </View>
    </View>
  </Modal>
);
}

export default inject('feathersStore')(observer(CancelItemModal));
