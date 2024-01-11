import React, {useState} from 'react';
import {ScrollView, View, Text, Button, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Picker} from '@react-native-picker/picker';
import WETextInput from '../CommonComponents/WETextInput';
import webEngageManager from '../WebEngageHandler/WebEngageManager';

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

  const [pushOptin, setPushOptin] = useState(false);
  const [inappOptin, setInappOptin] = useState(false);
  const [smsOptin, setSmsOptin] = useState(false);
  const [emailOptin, setEmailOptin] = useState(false);
  const [whatsappOptin, setWhatsappOptin] = useState(false);
  const [viberOptin, setViberOptin] = useState(false);

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
    console.log('WebEngage: User Profile Updated');
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

        <View style={styles.row}>
          <Text style={styles.label}>Location</Text>
          <WETextInput
            customStyle={styles.textbox}
            value={location}
            onChangeText={handleLocationChange}
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
      <Button title="Save" onPress={onSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
});

export default ProfileScreen;
