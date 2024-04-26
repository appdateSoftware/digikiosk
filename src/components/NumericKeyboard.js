/**
 * Digi Kiosk - React Native Template
 *
 * @format
 * @flow
 */

import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// import colors
import Colors from "../theme/colors";

const backspace = "arrow-back";

const NumericKeyboardTablet = ({ onPress = () => {}, pressBackspace = () => {} }) => (
  <View style={styles.container}>
    <TouchableOpacity onPress={onPress("1")} style={styles.keyboardButton}>
      <Text style={styles.number}>1</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("2")} style={styles.keyboardButton}>
      <Text style={styles.number}>2</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("3")} style={styles.keyboardButton}>
      <Text style={styles.number}>3</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("4")} style={styles.keyboardButton}>
      <Text style={styles.number}>4</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("5")} style={styles.keyboardButton}>
      <Text style={styles.number}>5</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("6")} style={styles.keyboardButton}>
      <Text style={styles.number}>6</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("7")} style={styles.keyboardButton}>
      <Text style={styles.number}>7</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("8")} style={styles.keyboardButton}>
      <Text style={styles.number}>8</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("9")} style={styles.keyboardButton}>
      <Text style={styles.number}>9</Text>
    </TouchableOpacity>   
    <TouchableOpacity onPress={onPress("0")} style={styles.keyboardButton}>
      <Text style={styles.number}>0</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress(".")} style={styles.keyboardButton}>
      <Text style={styles.number}>,</Text>
    </TouchableOpacity> 
    <TouchableOpacity
      onPress={pressBackspace()}
      style={styles.backspaceButton}
    >
      <Icon name={backspace} size={32} color={Colors.black} />
    </TouchableOpacity>
  </View>

);
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "60%",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 4,
    backgroundColor: Colors.itemBkgr
  },
  keyboardButton: {
    width: "30%",
    height: 48,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.keyboardButton,
    marginLeft: 4,
    marginVertical: 4,
    paddingLeft: 8,
    paddingTop: 4
  },
  backspaceButton: {
    width: "30%",
    height: 48,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: Colors.backspaceButton,
    marginLeft: 4,
    marginVertical: 4,
    paddingLeft: 8,
    paddingTop: 4  
  },
  number: {
    fontWeight: "600",
    fontSize: 18,
    color: Colors.onAccentColor
  },
});

export default NumericKeyboardTablet;
