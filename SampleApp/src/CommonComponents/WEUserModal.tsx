import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import WEButton from './WEButton';

const WEUserModal = ({
  visible,
  onClose,
  modalUI,
}: {
  visible: boolean;
  onClose: () => void;
  modalUI: React.FC;
}) => {
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
          {modalUI()}
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

export default WEUserModal;
