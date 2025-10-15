import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import WETextInput from '../CommonComponents/WETextInput';
import webEngageManager from '../WebEngageHandler/WebEngageManager';
import WEButton from '../CommonComponents/WEButton';
import WEUserModal from '../CommonComponents/WEUserModal';
import CONSTANTS from '../utils/Constants';
import GenderDropdown from '../utils/GenderDropdown';

const ProfileScreen: React.FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [hashedEmail, setHashedEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [hashedPhone, setHashedPhone] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState<string>('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [pushOptin, setPushOptin] = useState(true);
  const [inappOptin, setInappOptin] = useState(true);
  const [smsOptin, setSmsOptin] = useState(true);
  const [emailOptin, setEmailOptin] = useState(true);
  const [whatsappOptin, setWhatsappOptin] = useState(true);
  const [viberOptin, setViberOptin] = useState(true);

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
      customAttributeList.forEach(item => {
        const key = Object.keys(item)[0];
        const value = item[key];
        console.log(
          CONSTANTS.WEBENGAGE + 'Adding custom attribute key - value ',
          key,
          value,
        );
        webEngageManager.user.setAttribute(key, value);
      });
    }
    if (attributeToDelete) {
      console.log(
        CONSTANTS.WEBENGAGE +
          ' Deleting custom attribute - ' +
          attributeToDelete,
      );
      webEngageManager.user.deleteAttribute(attributeToDelete);
      setAttributeToDelete('');
    }
    console.log(CONSTANTS.WEBENGAGE + ' User Profile Updated successfylly ');
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
  };

  const onDeleteAttribute = () => {
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
        <WEButton
          onPress={onSaveAttribute}
          buttonText="Add"
          buttonStyle={styles.modalButton}
        />
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
        <WEButton
          onPress={onDeleteAttribute}
          buttonText="Delete"
          buttonStyle={styles.modalButton}
        />
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

  const onPushOptIn = () => {
    setPushOptin(!pushOptin);
    webEngageManager.user.setOptIn('push', !pushOptin);
  };

  const onInAppOptIn = () => {
    setInappOptin(!inappOptin);
    webEngageManager.user.setOptIn('in_app', !inappOptin);
  };

  const onSMSOptIn = () => {
    setSmsOptin(!smsOptin);
    webEngageManager.user.setOptIn('sms', !smsOptin);
  };

  const onEmailOptIn = () => {
    setEmailOptin(!emailOptin);
    webEngageManager.user.setOptIn('email', !emailOptin);
  };

  const onWhatsappOptIn = () => {
    setWhatsappOptin(!whatsappOptin);
    webEngageManager.user.setOptIn('whatsapp', !whatsappOptin);
  };

  const onViberOptIn = () => {
    setViberOptin(!viberOptin);
    webEngageManager.user.setOptIn('viber', !viberOptin);
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Profile Builder */}
      <View>
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
          <GenderDropdown value={gender} onChange={setGender} />
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

        <View>{renderCustomAttrList()}</View>

        <View style={styles.box}>
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.linkText}> Add Custom Attribute </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDeleteModal}>
            <Text style={styles.linkText}> Delete Custom Attribute </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Opt-in options */}
      <View style={styles.optinContainer}>
        <Text style={styles.optinHeader}>User Opt-Ins</Text>
        
        <View style={styles.optinRow}>

          <BouncyCheckbox 
            isChecked={pushOptin} 
            onPress={onPushOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>Push Notifications</Text>

        </View>

        <View style={styles.optinRow}>
          <BouncyCheckbox 
            isChecked={inappOptin} 
            onPress={onInAppOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>In-App Messages</Text>
        </View>

        <View style={styles.optinRow}>
          <BouncyCheckbox 
            isChecked={smsOptin} 
            onPress={onSMSOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>SMS</Text>
        </View>

        <View style={styles.optinRow}>
          <BouncyCheckbox 
            isChecked={emailOptin} 
            onPress={onEmailOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>Email</Text>
        </View>

        <View style={styles.optinRow}>
          <BouncyCheckbox 
            isChecked={whatsappOptin} 
            onPress={onWhatsappOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>WhatsApp</Text>
        </View>

        <View style={styles.optinRow}>
          <BouncyCheckbox 
            isChecked={viberOptin} 
            onPress={onViberOptIn}
            fillColor="#A782E4"
            size={25}
          />
          <Text style={styles.optinLabel}>Viber</Text>
        </View>
      </View>
      <WEButton
        buttonText="Save"
        onPress={onSave}
        buttonStyle={styles.button}
      />
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
    marginLeft: 20,
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    marginTop: 20,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    color: '#000000',
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
  optinContainer: {
    marginTop: 30,
    marginRight: 20,
    backgroundColor: '#6289afff',
    borderRadius: 15,
    padding: 20,
    borderWidth: 2,
    borderColor: '#A782E4',
    shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.15,
    // shadowRadius: 6,
    // elevation: 5,
  },
  optinHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#A782E4',
    paddingBottom: 10,
  },
  optinRow: {
    flexDirection: 'row',
    // alignItems: 'center',
    height: 40,
    // paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optinLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#030609ff',
    marginLeft: 15,
    flex: 1,
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
  button: {
    backgroundColor: '#A782E4',
    padding: 10,
    width: 300,
    margin: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 50,
  },
  modalButton: {
    backgroundColor: '#A782E4',
    padding: 10,
    width: 200,
    margin: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  attributeTextbox: {
    width: 200,
    padding: 10,
  },
  box: {
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    flex: 1,
    marginRight: 10,
  },
  textbox: {
    width: 250,

    padding: 10,
  },
  picker: {
    width: 200,
    padding: 10,
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
    justifyContent: 'space-between',
    marginHorizontal: 20,
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;
