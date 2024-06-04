// EventsScreen.js
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import COLORS from '../../Styles/Colors';
import WETextInput from '../../CommonComponents/WETextInput';
import {Picker} from '@react-native-picker/picker';
import WEUserModal from '../../CommonComponents/WEUserModal';
import WEButton from '../../CommonComponents/WEButton';
import ShoppingEventsScreen from './ShoppingEventScreen';
import webEngageManager from '../../WebEngageHandler/WebEngageManager';
import CONSTANTS from '../../utils/Constants';

const EventsScreen = () => {
  const [eventName, setEventName] = useState<string>('');
  const [times, setTimes] = useState<number>(1);
  const [customAttributeList, setCustomAttributeList] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [keyAttribute, setKeyAttribute] = useState('');
  const [valAttribute, setValAttribute] = useState('');

  const numericValues = Array.from({length: 10}, (_, index) => index + 1);

  const handleTrackButtonPress = () => {
    console.log(
      CONSTANTS.WEBENGAGE +
        ' Event Name' +
        eventName +
        ' is triggered with custom attributes' +
        JSON.stringify(customAttributeList) +
        ' for ' +
        times +
        ' times',
    );
    for (let i = 0; i < times; i++) {
      webEngageManager.track(eventName, customAttributeList);
    }
  };
  const onKeyChange = (text: string) => {
    setKeyAttribute(text);
  };

  const onValueAttrChange = (text: string) => {
    setValAttribute(text);
  };

  const onSaveAttribute = () => {
    let updatedAttributeList = {};
    if (keyAttribute && valAttribute) {
      updatedAttributeList = {
        ...customAttributeList,
        [keyAttribute]: valAttribute,
      };
      setCustomAttributeList(updatedAttributeList);
    }
    toggleModal();
    console.log(
      CONSTANTS.WEBENGAGE + 'Custom Attribute Updated',
      updatedAttributeList,
    );
  };

  const onEventNameChange = (text: string) => {
    setEventName(text);
  };

  const toggleModal = () => {
    setShowUserModal(!showUserModal);
  };

  const renderCustomAttrList = () => {
    if (Object.keys(customAttributeList).length === 0) {
      return null;
    }
    return (
      <View>
        <Text style={styles.header}>Custom Attributes</Text>
        <View style={styles.rowList}>
          <Text style={styles.keyText}>Key </Text>
          <Text style={styles.valueText}>Value</Text>
        </View>
        {Object.entries(customAttributeList).map(
          ([key, value]: [string, any], index) => {
            return (
              <View style={styles.rowList} key={index}>
                <Text style={styles.keyText}>{key} </Text>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            );
          },
        )}
      </View>
    );
  };

  const customAttributeUI = () => {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalRow}>
          <Text>Key</Text>
          <WETextInput
            customStyle={styles.attributeTextbox}
            value={keyAttribute}
            onChangeText={onKeyChange}
          />
        </View>
        <View style={styles.modalRow}>
          <Text>Value</Text>
          <WETextInput
            customStyle={styles.attributeTextbox}
            value={valAttribute}
            onChangeText={onValueAttrChange}
          />
        </View>
        <WEButton
          onPress={onSaveAttribute}
          buttonText="Save"
          buttonStyle={styles.modalButton}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.row}>
          <Text style={styles.label}>Event Name:</Text>
          <WETextInput
            customStyle={styles.input}
            placeholder="Enter event name"
            value={eventName}
            onChangeText={onEventNameChange}
          />
        </View>
        <View>{renderCustomAttrList()}</View>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={[styles.label, styles.hyperlink]}>
            Add Custom Attribute:
          </Text>
        </TouchableOpacity>
        <View style={styles.row}>
          <Text style={styles.label}>Times:</Text>
          <Picker
            selectedValue={times}
            onValueChange={value => setTimes(value)}
            mode="dropdown"
            style={styles.picker}>
            {numericValues.map(value => (
              <Picker.Item
                key={value}
                label={value.toString()}
                value={value.toString()}
              />
            ))}
          </Picker>
        </View>
        <WEUserModal
          modalUI={customAttributeUI}
          visible={showUserModal}
          onClose={toggleModal}
        />

        <WEButton
          onPress={handleTrackButtonPress}
          buttonText="Track"
          buttonStyle={styles.trackButton}
        />
      </View>
      <View style={styles.horizontalLine} />

      <ShoppingEventsScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: 200,
  },
  hyperlink: {
    color: COLORS.blue,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  horizontalLine: {
    borderWidth: 1,
    marginVertical: 20,
    borderColor: COLORS.grey,
  },
  picker: {
    height: 50,
    width: 100,
    marginBottom: 10,
  },
  trackButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  trackButtonText: {
    color: 'white',
  },
  rowList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 2,
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 14,
  },
  valueText: {
    marginLeft: 4,
    fontSize: 14,
  },
  modalContainer: {},
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  attributeTextbox: {
    width: 200,
    padding: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
});

export default EventsScreen;
