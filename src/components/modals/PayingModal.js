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
  View,
  ActivityIndicator,
  Pressable
} from "react-native";

import Colors from "../../theme/colors";
import Icon from "../../components/Icon";
import { inject, observer } from "mobx-react";
import _useTranslate from '../../hooks/_useTranslate';
import { DateTime } from "luxon";

const CLOSE_ICON = "close";
const CHECK_ICON = "checkmark";

const ripple = {
  borderless: true,
}

const PayingModal = ({  
  checkButton,
  deleteButton,  
  visible = false,
  feathersStore,
  checking
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
          <Text style={styles.textStyle}>{common.cardPayment}</Text> 
          <ActivityIndicator color={Colors.primaryColor} size="large" />
          <View style={styles.separator}></View> 
          <View style={styles.buttonsContainer}>
            <Pressable android_ripple={ripple} onPress={checkButton}
              disabled={checking}> 
              <View style={[styles.buttonIconContainer, styles.checkBtn]}>
                <Icon
                  name={CHECK_ICON}
                  size={22}
                  color={Colors.white}
                />
              </View>
            </Pressable>
            <Pressable android_ripple={ripple} onPress={deleteButton}> 
              <View style={[styles.buttonIconContainer, styles.deleteBtn]}>
                <Icon
                  name={CLOSE_ICON}
                  size={22}
                  color={Colors.white}
                />
              </View>
            </Pressable>           
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
    width: "80%",
    backgroundColor: Colors.discount,
    borderRadius: 20,
    paddingHorizontal: 35,
    paddingVertical: 65,
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
  topButton: {
    position: "absolute",
    top: 16,
    borderRadius: 18,
    backgroundColor: Colors.googleButton,
    borderWidth: 2,
    borderColor: Colors.white
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 2,
    paddingHorizontal: 16,  
    width: 300
  }, 
  buttonIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    margin: 10
  },
  checkBtn: {
    backgroundColor: Colors.delivered
  },
  deleteBtn: {
    backgroundColor: Colors.completed
  },
  right: { right: 16 },
  textStyle: {
    fontSize: 20,
    color: Colors.onPrimaryColor,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30
  },
  separator: {
    height: 20
  }
 
});

export default inject('feathersStore')(observer(PayingModal));
