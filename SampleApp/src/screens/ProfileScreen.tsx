import React, {useState} from 'react';
import {ScrollView, View, Text, Button, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Picker} from '@react-native-picker/picker';
import WETextInput from '../CommonComponents/WETextInput';
import webEngageManager from '../WebEngageHandler/WebEngageManager';
import WEButton from '../CommonComponents/WEButton';
import {TouchableOpacity} from 'react-native-gesture-handler';
import WEUserModal from '../CommonComponents/WEUserModal';

const ProfileScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hashedEmail, setHashedEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hashedPhone, setHashedPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [gender, setGender] = useState('Unknown');
  const [birthDate, setBirthDate] = useState<string>('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [pushOptin, setPushOptin] = useState(false);
  const [inappOptin, setInappOptin] = useState(false);
  const [smsOptin, setSmsOptin] = useState(false);
  const [emailOptin, setEmailOptin] = useState(false);
  const [whatsappOptin, setWhatsappOptin] = useState(false);
  const [viberOptin, setViberOptin] = useState(false);
  const [keyAttribute, setKeyAttribute] = useState('');
  const [valAttribute, setValAttribute] = useState('');
  const [customAttributeList, setCustomAttributeList] = useState([]);
  const [attributeToDelete, setAttributeToDelete] = useState('');

  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
  };

  const handleLastNameChange = (text: string) => {
    setLastName(text);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handleHashedEmailChange = (text: string) => {
    setHashedEmail(text);
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
  };

  const handleHashedPhoneChange = (text: string) => {
    setHashedPhone(text);
  };

  const handleCompanyChange = (text: string) => {
    setCompany(text);
  };

  const handleLocationChange = (text: string) => {
    setLocation(text);
  };

  const handleBirthDateChange = (text: string) => {
    setBirthDate(text);
  };

  const onSave = () => {
    if (firstName) {
      webEngageManager.user.setFirstName(firstName);
    }
    if (lastName) {
      webEngageManager.user.setLastName(lastName);
    }
    if (email) {
      webEngageManager.user.setEmail(email);
    }
    if (hashedEmail) {
      webEngageManager.user.setHashedEmail(hashedEmail);
    }
    if (phone) {
      webEngageManager.user.setPhone(phone);
    }
    if (hashedPhone) {
      webEngageManager.user.setHashedPhone(hashedPhone);
    }
    if (company) {
      webEngageManager.user.setCompany(company);
    }
    if (location) {
      const locationArray = location.split(',');
      if (locationArray.length === 2) {
        webEngageManager.user.setLocation(locationArray[0], locationArray[1]);
      }
    }
    if (gender) {
      webEngageManager.user.setGender(gender);
    }
    if (birthDate) {
      webEngageManager.user.setBirthDateString(birthDate);
    }
    if (customAttributeList?.length) {
      customAttributeList.forEach((item, index) => {
        const key = Object.keys(item)[0];
        const value = item[key];
        console.log('WebEngage: Add custom attribute key - value ', key, value);
        webEngageManager.user.setAttribute(key, value);
      });
    }
    if (attributeToDelete) {
      console.log('WebEngage: Delete custom attribute - ' + attributeToDelete);
      webEngageManager.user.deleteAttribute(attributeToDelete);
      setAttributeToDelete('');
    }
    console.log('WebEngage: User Profile Updated');
  };

  const onKeyChange = (text: string) => {
    setKeyAttribute(text);
  };

  const onValueAttrChange = (text: string) => {
    setValAttribute(text);
  };

  const onSaveAttribute = () => {
    if (keyAttribute && valAttribute) {
      const updatedAttributeList: any = [
        ...customAttributeList,
        {[keyAttribute]: valAttribute},
      ];
      setCustomAttributeList(updatedAttributeList);
    }
    toggleModal();
    console.log('WebEngage: Custom Attribute Updated', customAttributeList);
  };

  const onDeleteAttribute = () => {
    console.log('WebEngage: Custom Attribute Updated', customAttributeList);
    toggleDeleteModal();
  };

  const onChangeToDeleteAttr = (text: string) => {
    setAttributeToDelete(text);
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
        <WEButton onPress={onSaveAttribute} buttonText="Save" />
      </View>
    );
  };

  const deleteAttributeUI = () => {
    return (
      <View style={styles.modalContainer}>
        <Text> Enter the key to delete attribute </Text>
        <View style={styles.modalRow}>
          <Text>Key</Text>
          <WETextInput
            customStyle={styles.attributeTextbox}
            value={attributeToDelete}
            onChangeText={onChangeToDeleteAttr}
          />
        </View>
        <WEButton onPress={onDeleteAttribute} buttonText="Save" />
      </View>
    );
  };

  const renderCustomAttrList = () => {
    if (customAttributeList.length === 0) {
      return null;
    }
    return customAttributeList.map((item, index) => {
      const key = Object.keys(item)[0];
      const value = item[key];
      return (
        <View style={styles.rowList} key={index}>
          <Text style={styles.keyText}>{key}: </Text>
          <Text style={styles.valueText}>{value}</Text>
        </View>
      );
    });
  };

  const toggleModal = () => {
    setShowUserModal(!showUserModal);
  };
  const toggleDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Builder */}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.label}>FirstName</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={firstName}
            onChangeText={handleFirstNameChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>LastName</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={lastName}
            onChangeText={handleLastNameChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={email}
            onChangeText={handleEmailChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hashed Email</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={hashedEmail}
            onChangeText={handleHashedEmailChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Phone</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={phone}
            onChangeText={handlePhoneChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hashed Phone</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={hashedPhone}
            onChangeText={handleHashedPhoneChange}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Company</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={company}
            onChangeText={handleCompanyChange}
          />
        </View>
        {/* TODO - Add this for library in iOS */}
        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={location}
            onChangeText={handleLocationChange}
            placeholderText="Latitude,Longitude"
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          {/* TODO Add a Picker */}
          <Picker
            selectedValue={gender}
            onValueChange={value => setGender(value)}
            mode="dropdown"
            style={styles.picker}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="" />
          </Picker>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Birth Date</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={birthDate}
            onChangeText={handleBirthDateChange}
            placeholderText="YYYY-MM-DD"
          />
        </View>

        <View style={styles.customListBox}>{renderCustomAttrList()}</View>

        <View style={styles.box}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.linkText}> Add Custom Attribute </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDeleteModal}>
            <Text style={styles.linkText}> Delete Custom Attribute </Text>
          </TouchableOpacity>
        </View>

        {/* TODO Remove this button */}
        <WEButton
          buttonText={'Test Events'}
          onPress={() => webEngageManager.track('Test Event')}
        />
      </View>

      {/* Opt-in options */}
      <View style={styles.optinOptions}>
        <BouncyCheckbox isChecked={pushOptin} onPress={setPushOptin} />
        <Text>Push</Text>

        <BouncyCheckbox isChecked={inappOptin} onPress={setInappOptin} />
        <Text>In-app</Text>

        <BouncyCheckbox isChecked={smsOptin} onPress={setSmsOptin} />
        <Text>SMS</Text>

        <BouncyCheckbox isChecked={emailOptin} onPress={setEmailOptin} />
        <Text>Email</Text>

        <BouncyCheckbox isChecked={whatsappOptin} onPress={setWhatsappOptin} />
        <Text>Whatsapp</Text>

        <BouncyCheckbox isChecked={viberOptin} onPress={setViberOptin} />
        <Text>Viber</Text>
      </View>
      <WEButton buttonText="Save" onPress={onSave} />
      <WEUserModal
        modalUI={customAttributeUI}
        visible={showUserModal}
        onClose={toggleModal}
      />
      <WEUserModal
        modalUI={deleteAttributeUI}
        visible={showDeleteModal}
        onClose={toggleDeleteModal}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  modalContainer: {},
  linkText: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  table: {
    // Add styles for the table layout
  },
  optinOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 15,
  },
  attributeTextbox: {
    // flex: 2,
    width: 200,

    padding: 10,
  },
  box: {
    alignItems: 'center',
    marginBottom: 15,
  },
  customListBox: {
    // alignItems: 'center',
    // marginBottom: 15,
  },
  label: {
    flex: 1,
    marginRight: 10,
  },
  textbox: {
    // flex: 2,
    width: 250,

    padding: 10,
  },
  picker: {
    marginVertical: 30,
    width: 300,
    padding: 10,
    borderWidth: 1,
    borderColor: '#fff',
    color: '#000',
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  valueText: {
    marginLeft: 4,
  },
  rowList: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    borderBottomWidth: 1,

    // alignSelf: 'auto',
  },
});

export default ProfileScreen;
