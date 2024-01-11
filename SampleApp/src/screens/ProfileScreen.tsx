import React, {useState} from 'react';
import {ScrollView, View, Text, Button, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
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
    } else if (lastName) {
      webEngageManager.user.setLastName(lastName);
    } else if (email) {
      webEngageManager.user.setEmail(email);
    } else if (hashedEmail) {
      webEngageManager.user.setHashedEmail(hashedEmail);
    } else if (phone) {
      webEngageManager.user.setPhone(phone);
    } else if (hashedPhone) {
      webEngageManager.user.setHashedPhone(hashedPhone);
    } else if (company) {
      webEngageManager.user.setCompany(company);
    } else if (location) {
      const locationArray = location.split(',');
      if (locationArray.length === 2) {
        webEngageManager.user.setLocation(locationArray[0], locationArray[1]);
      }
    } else {
      console.log('WebEngage: User Profile Not updated');
      // TODO
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
  genderPicker: {
    width: 100,
  },
  dropDownPicker: {
    width: 200,
  },
});

export default ProfileScreen;
