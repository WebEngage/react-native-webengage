import React from 'react';
import {
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface WETextInputProps extends TextInputProps {
  customStyle?: StyleProp<ViewStyle>;
  placeholderText?: string;
  placeholderTextColor?: string;
  underlineColorAndroid?: string;
  selectionColor?: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
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
  onChangeText,
}) => {
  return (
    <TextInput
      style={[styles.defaultInput, customStyle]}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderTextColor || '#999'}
      placeholder={placeholderText}
      underlineColorAndroid={underlineColorAndroid || 'transparent'}
      selectionColor={selectionColor || '#4285f4'} // Example color, you can change it
      secureTextEntry={secureTextEntry || false}
      autoCapitalize={autoCapitalize || 'sentences'}
    />
  );
};

const styles = StyleSheet.create({
  defaultInput: {
    height: 40,
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    fontSize: 16,
    width: 100,
    color: '#333',
  },
});

export default WETextInput;
