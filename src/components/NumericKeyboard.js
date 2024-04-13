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

// NumericKeyboard backspace icon name config
const backspace = "backspace";

// NumericKeyboard & ActionButton Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: Colors.background
  },
  keyboardButton: {
    width: "32%",
    height: 64,
    justifyContent: "center",
    alignItems: "center"
  },
  number: {
    fontWeight: "300",
    fontSize: 24,
    color: Colors.black
  },
  actionButtonTitle: {
    padding: 12,
    fontWeight: "500",
    fontSize: 13,
    color: Colors.black
  }
});

const NumericKeyboard = ({ onPress = () => {}, pressBackspace = () => {} }) => (
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
    <TouchableOpacity onPress={onPress(".")} style={styles.keyboardButton}>
      <Text style={styles.number}>,</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onPress("0")} style={styles.keyboardButton}>
      <Text style={styles.number}>0</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={pressBackspace()}
      style={styles.keyboardButton}
    >
      <Icon name={backspace} size={24} color={Colors.black} />
    </TouchableOpacity>
  </View>
);

export default NumericKeyboard;
