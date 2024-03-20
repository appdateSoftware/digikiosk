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
  View,
  Image,
  Platform,  
  Pressable
} from "react-native";

import Colors from "../../theme/colors";
import Icon from "../../components/Icon";
import { inject, observer } from "mobx-react";

const CLOSE_ICON = Platform.OS === "ios" ? "ios-close" : "md-close";

const ripple = {
  borderless: true,
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

const greek = require("../../assets/img/languages/greek.png");
const english = require("../../assets/img/languages/us.png");
const germany = require("../../assets/img/languages/germany.png");
const france = require("../../assets/img/languages/france.png");
const spain = require("../../assets/img/languages/spain.png");
const italy = require("../../assets/img/languages/italy.png");

const LanguageModal = ({
  title, 
  cancelButton,
  visible = false,  
  feathersStore,
  store1
}) => {

  const toggleLanguage = lang => () => {
    store1.realm.write(()=>{
      store1.realm.objects('Language')[0].name = lang     
    })
    feathersStore.setLanguage(lang);
  //  handleClose();
  }

  const findImage = (code)  => { 
    switch (code){
      case "el" :      
        return greek;
      case "en" :  
        return english;
      case "de" :
        return germany;
      case "fr" :
        return france;
      case "es" :
        return spain;
      case "it" :
        return italy;
    }
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
        <TouchableHighlight
          style={{ ...styles.languageButton }}
          onPress={toggleLanguage("el")}
        >
          <View style={styles.row}>
          
              <View style={styles.radioButton}>             
                <View style={styles.checkedContainer}>
                { feathersStore.language === "el" &&
                  <View style={styles.dot}>
                  </View>
                }
                </View>             
              </View>  
           
            <Text style={styles.textStyle}>{"Ελληνικά"}</Text>
            <Image
              source={greek}
              style={ {width: 24, marginRight: 6 }}              
              resizeMode="contain"
            />
          </View>
        </TouchableHighlight>
        {feathersStore.settings?.targetLanguages?.map(lang =>
        <TouchableHighlight
          key={lang?.code}
          style={{ ...styles.languageButton  }}
          onPress={toggleLanguage(lang?.code)}
        >
          <View style={styles.row}>

              <View style={styles.radioButton}>             
                <View style={styles.checkedContainer}>
                { feathersStore.language === lang?.code &&
                  <View style={styles.dot}>
                  </View>
                }
                </View>             
              </View> 
           
            <Text style={styles.textStyle}>{lang?.name}</Text>
            <Image
              source={findImage(lang?.code)}
              style={ {width: 24, marginRight: 6 }}              
              resizeMode="contain"
            />          
          </View>
        </TouchableHighlight>  
        )} 
      </View>
    </View>
  </Modal>
)};

export default inject('store1', 'feathersStore')(observer(LanguageModal));
