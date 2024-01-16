import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import COLORS from '../Styles/Colors';

const WEButton = (props: {
  onPress: () => void;
  buttonText: String;
  buttonStyle?: object;
  buttonTextStyle?: object;
}) => {
  const {
    onPress,
    buttonText = '',
    buttonStyle = {},
    buttonTextStyle = {},
  } = props;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.buttonText, buttonTextStyle]}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.purple,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
});

export default WEButton;
