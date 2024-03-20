/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

// import components
import Button from "../buttons/Button";
import LinkButton from "../buttons/LinkButton";

// import colors, layout
import Colors from "../../theme/colors";
import Layout from "../../theme/layout";

// InputModal Config
const IOS = Platform.OS === "ios";

// InputModal Styles
const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.24)"
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: Layout.SCREEN_WIDTH - 2 * Layout.SMALL_MARGIN - 8,
    borderRadius: 4,
    backgroundColor: Colors.background
  },
  title: {
    marginBottom: 4,
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
  inputContainer: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#e3e3e3",
    borderRadius: 4
  },
  textInput: {
    height: 48,    
    margin: 2,
    borderWidth: 1,
    padding: 2,
    backgroundColor: Colors.surface,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
    width: "100%"
  },
  button: {
    borderRadius: 4
  }
});


// InputModal
const InputModal = ({
  message,
  onRequestClose = () => {},
  title,
  input,
  inputMethod,
  inputPlaceholder,
  inputKeyboardType = "text",
  buttonTitle,
  onButtonPress,
  onClosePress,
  closeButtonText = "CANCEL",
  statusBarColor = "rgba(0, 0, 0, 0.24)",
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
        <KeyboardAvoidingView behavior="position" enabled={IOS}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>{title}</Text>

            {message !== "" && message !== undefined && (
              <Text style={styles.message}>{message}</Text>
            )}

            <View style={styles.inputContainer}>
              <TextInput
                onChangeText={text => inputMethod(text)}
                value={input}                  
                placeholder={inputPlaceholder}
                keyboardType={inputKeyboardType}
                style={styles.textInput}
              />
            </View>

            <View style={styles.buttonContainer}>
              <Button
                onPress={onButtonPress}
                title={buttonTitle}
                buttonStyle={styles.button}
              />
            </View>

            <LinkButton
              onPress={onClosePress}
              title={closeButtonText}
            />
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);

export default InputModal;
