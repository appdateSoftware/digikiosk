/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from "react";
import { Modal, StatusBar, StyleSheet, Text, View } from "react-native";

// import components
import Button from "../buttons/Button";
import Icon from "../Icon";

// import colors, layout
import Colors from "../../theme/colors";
import Layout from "../../theme/layout";

// InfoModal Config

// InfoModal Styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: Layout.SCREEN_WIDTH - 2 * Layout.SMALL_MARGIN - 8,
    borderRadius: 4,
    backgroundColor: Colors.background
  },
  title: {
    paddingVertical: 8,
    fontWeight: "700",
    fontSize: 18,
    color: Colors.primaryText
  },
  message: {
    marginBottom: 16,
    padding: 8,
    fontWeight: "400",
    color: Colors.secondaryText,
    textAlign: "center"
  },
  buttonContainer: {
    width: "100%"
  },
  

});


// InfoModal
const InfoModal = ({
  message,
  onRequestClose = () => {},
  iconName,
  iconColor,
  statusBarColor = "rgba(0, 0, 0, 0.2)",
  title,
  buttonTitle,
  onButtonPress,
  visible = false
}) => (
  <Modal
    animationType="none"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <StatusBar backgroundColor={statusBarColor} />
    <View style={styles.modalWrapper}>
      <View style={styles.modalContainer}>
        <Icon name={iconName} size={72} color={iconColor} />
        <Text style={styles.title}>{title}</Text>

        {message !== "" && message !== undefined && (
          <Text style={styles.message}>{message}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={onButtonPress} title={buttonTitle} rounded />
        </View>
      </View>
    </View>
  </Modal>
);

export default InfoModal;
