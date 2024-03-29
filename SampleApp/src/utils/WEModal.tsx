import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import WEButton from '../CommonComponents/WEButton';
import CONSTANTS from './Constants';
import WETextInput from '../CommonComponents/WETextInput';

const WEModal = ({
  visible,
  onClose,
  onLogin,
  isJwtModal = false,
  onPasswordUpdate,
}: {
  visible: boolean;
  onClose: () => void;
  onLogin?: (username: string, password?: string) => void;
  onPasswordUpdate?: (password: string) => void;
  isJwtModal?: boolean;
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const buttonLabel = isJwtModal ? 'Update JWT' : 'Login';

  const handleLogin = () => {
    if (isJwtModal) {
      // JWT Update Modal
      if (password && onPasswordUpdate) {
        onPasswordUpdate(password);
      }
    } else {
      // Login Modal
      if (username) {
        if (onLogin) {
          onLogin(username, password);
        }
        setErrorMessage('');
        onClose();
      } else {
        setErrorMessage(CONSTANTS.WEBENGAGE + 'Invalid username or password');
      }
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
      transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>{buttonLabel}</Text>
          {!isJwtModal && (
            <WETextInput
              customStyle={styles.input}
              placeholder="Username"
              onChangeText={text => setUsername(text)}
              value={username}
            />
          )}
          <WETextInput
            customStyle={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <WEButton
            buttonText={buttonLabel}
            buttonStyle={styles.loginButton}
            onPress={handleLogin}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  loginButton: {
    padding: 10,
    width: 120,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    width: 25,
    top: 5,
    right: 10,
    padding: 5,
  },
  closeButtonText: {
    color: '#0a0909',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default WEModal;
