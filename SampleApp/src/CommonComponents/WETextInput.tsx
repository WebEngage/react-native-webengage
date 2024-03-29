import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import COLORS from '../Styles/Colors';

interface WETextInputProps extends TextInputProps {
  customStyle?: StyleProp<ViewStyle>;
  placeholderText?: string;
  placeholderTextColor?: string;
  underlineColorAndroid?: string;
  selectionColor?: string;
  secureTextEntry?: boolean;
  value: string | undefined;
  keyboardType?: 'numeric' | 'default' | 'email-address' | 'phone-pad';
  onChangeText: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

const WETextInput: React.FC<WETextInputProps> = ({
  customStyle,
  placeholderTextColor,
  placeholderText,
  underlineColorAndroid,
  selectionColor,
  secureTextEntry,
  autoCapitalize,
  value,
  keyboardType,
  onChangeText,
  autoCorrect,
}) => {
  return (
    <TextInput
      style={[styles.defaultInput, customStyle]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor || '#999'}
      placeholder={placeholderText}
      underlineColorAndroid={underlineColorAndroid || 'transparent'}
      selectionColor={selectionColor || '#4285f4'}
      secureTextEntry={secureTextEntry || false}
      autoCapitalize={autoCapitalize || 'none'}
      keyboardType={keyboardType || 'default'}
      autoCorrect={autoCorrect || false}
    />
  );
};

const styles = StyleSheet.create({
  defaultInput: {
    height: 40,
    borderColor: COLORS.white,
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
    width: 100,
    color: COLORS.darkGray,
  },
});

export default WETextInput;
