/**
 * Food Delivery - React Native Template
 *
 * @format
 * @flow
 */

import React from "react";
import type ReactElement from "react";
import { StyleSheet, Text as RNText } from "react-native";

// import colors
import Colors from "../../theme/colors";

const styles = StyleSheet.create({
  h1: {
    fontWeight: "300",
    fontSize: 96,
    color: Colors.primaryText,
    letterSpacing: -1.5
  },
  h2: {
    fontWeight: "300",
    fontSize: 60,
    color: Colors.primaryText,
    letterSpacing: -0.5
  },
  h3: {
    fontWeight: "400",
    fontSize: 48,
    color: Colors.primaryText
  },
  h4: {
    fontWeight: "400",
    fontSize: 34,
    color: Colors.primaryText,
    letterSpacing: 0.25
  },
  h5: {
    fontWeight: "400",
    fontSize: 24,
    color: Colors.primaryText
  },
  h6: {
    fontWeight: "500",
    fontSize: 20,
    color: Colors.primaryText,
    letterSpacing: 0.15
  },
  title: {
    fontWeight: "500",
    fontSize: 25,
    lineHeight: 30,
    color: Colors.primaryText
  },
  subtitle1: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    color: Colors.primaryText,
    letterSpacing: 0.15
  },
  subtitle2: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    color: Colors.secondaryText,
    letterSpacing: 0.1
  },
  text: { fontWeight: "400" },
  // body1
  paragraph: {
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    color: Colors.secondaryText
  },
  // body 2
  smallText: {
    fontWeight: "400",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.25,
    color: Colors.secondaryText
  },
  buttonText: {
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.75
  },
  caption: {
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
    color: Colors.secondaryText
  }
});

export const Heading1 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h1, style]} {...props} />
);

export const Heading2 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h2, style]} {...props} />
);

export const Heading3 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h3, style]} {...props} />
);

export const Heading4 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h4, style]} {...props} />
);

export const Heading5 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h5, style]} {...props} />
);

export const Heading6 = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.h6, style]} {...props} />
);

export const Title = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.title, style]} {...props} />
);

export const Subtitle1 = ({
  style,
  ...props
}: Object): ReactElement<RNText> => (
  <RNText style={[styles.subtitle1, style]} {...props} />
);

export const Subtitle2 = ({
  style,
  ...props
}: Object): ReactElement<RNText> => (
  <RNText style={[styles.subtitle2, style]} {...props} />
);

export const Text = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.text, style]} {...props} />
);

export const Paragraph = ({
  style,
  ...props
}: Object): ReactElement<RNText> => (
  <RNText style={[styles.paragraph, style]} {...props} />
);

export const SmallText = ({
  style,
  ...props
}: Object): ReactElement<RNText> => (
  <RNText style={[styles.smallText, style]} {...props} />
);

export const ButtonText = ({
  style,
  ...props
}: Object): ReactElement<RNText> => (
  <RNText style={[styles.buttonText, style]} {...props} />
);

export const Caption = ({ style, ...props }: Object): ReactElement<RNText> => (
  <RNText style={[styles.caption, style]} {...props} />
);
