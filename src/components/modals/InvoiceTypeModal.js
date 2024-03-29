/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {useState, useEffect} from "react";
import { 
  Modal,
  TouchableHighlight,  
  StyleSheet,
  Text,  
  View,
  Image,
  Platform,  
  Pressable
} from "react-native";

import Colors from "../../theme/colors";
import Icon from "../../components/Icon";
import { inject, observer } from "mobx-react";
import {useRealm} from '@realm/react';
import { AppSchema } from "../../services/receipt-service";

const CLOSE_ICON = "close";

const ripple = {
  borderless: true,
}



const InvoiceTypeModal = ({
  title, 
  cancelButton,
  visible = false,  
  feathersStore,
}) => {

  const realm = useRealm();
  const [invoiceTypes, setInvoiceTypes] = useState([]);

  useEffect(() => {
    setInvoiceTypes(AppSchema.invoiceTypes)
  }, [AppSchema.invoiceTypes]);

  const toggleInvoiceType = invoiceType => () => {
    realm.write(()=>{
      realm.objects('InvoiceType')[0].name = invoiceType     
    })
    feathersStore.setInvoiceType(invoiceType);
  //  handleClose();
  } 

  return (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}       
  >
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
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
        <Text style={styles.modalText}>{title}</Text>
     
        {invoiceTypes?.map(invoiceType =>
        <TouchableHighlight
          key={invoiceType?.name}
          style={{ ...styles.languageButton  }}
          onPress={toggleInvoiceType(invoiceType?.name)}
        >
          <View style={styles.row}>

              <View style={styles.radioButton}>             
                <View style={styles.checkedContainer}>
                { feathersStore.invoiceType === invoiceType?.name &&
                  <View style={styles.dot}>
                  </View>
                }
                </View>             
              </View> 
           
            <Text style={styles.textStyle}>{invoiceType?.invoiceTypeName}</Text>
                   
          </View>
        </TouchableHighlight>  
        )} 
      </View>
    </View>
  </Modal>
)};

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
    backgroundColor: Colors.googleButton,
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
  languageButton: {
    width:"90%",
    padding: 10,
    marginBottom: 5,  
    borderRadius: 8,
    backgroundColor: Colors.surface
  },
  textStyle: {
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    color: Colors.onPrimaryColor,
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
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
  radioButton: {    
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.googleButton,
    backgroundColor: Colors.background
  },
  checkedContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 18,
    height: 18,
  },
  dot: {
    borderWidth: 4,
    borderRadius: 4,
    borderColor: Colors.googleButton
  }
});

export default inject('feathersStore')(observer(InvoiceTypeModal));
