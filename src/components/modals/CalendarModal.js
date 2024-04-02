/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React from "react";
import { Modal, StatusBar, StyleSheet, Text, View } from "react-native";

import Button from "../buttons/Button";
import Icon from "../Icon";

import Colors from "../../theme/colors";
import Layout from "../../theme/layout";

import {Calendar, LocaleConfig} from 'react-native-calendars';

const CalendarModal = ({
  message,
  cancelButton = () => {},
  iconName,
  iconColor,
  statusBarColor = "rgba(0, 0, 0, 0.2)",
  title,
  setFrom,
  markedDates,
  buttonTitle,  
  visible = false
}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={cancelButton}
  >
    <StatusBar backgroundColor={statusBarColor} />
    <View style={styles.modalWrapper}>
      <View style={styles.modalContainer}>
      <Text style={styles.title}>{title}</Text>
        <Calendar
          onDayPress={day => {
            setFrom(day.dateString);
          }}  
          markedDates={markedDates}          
        />
        <View style={styles.buttonContainer}>
          <Button onPress={cancelButton} title={buttonTitle} rounded />
        </View>
      </View>
    </View>
  </Modal>
);

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
  }
});

export default CalendarModal;
