import React from 'react';
import {View, StyleSheet, ScrollView, Alert, Text} from 'react-native';

// import WEModal from '../WEModal';
import {navigate} from '../Navigation/NavigationService';
import WEButton from '../CommonComponents/WEButton';
import WEModal from '../Utils/WEModal';
import COLORS from '../Styles/Colors';
import webEngageManager from '../WebEngageHandler/WebEngageManager';
import AsyncStorageUtil from '../Utils/AsyncStorageUtils';

// TODO Add Navigation Type
const HomeScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isJwtModalVisible, setIsJwtModalVisible] = React.useState(false);
  const [userName, setUserName] = React.useState<string>('');
  const [securityExceptionLabel, setSecurityExceptionLabel] =
    React.useState<string>('');

  const retrieveUserData = async () => {
    const data = await AsyncStorageUtil.getItem<string>('userName');
    if (data) {
      setUserName(data);
    }
    console.log('Retrieved Data:', data);
  };

  // TODO - Enable this when sdk security is added
  // React.useEffect(() => {
  //   webEngageManager.user.tokenInvalidatedCallback(invalidTokenCallback);
  // });

  // const invalidTokenCallback = (data: any) => {
  //   console.log('WEModal: Invalid token callback ', data.error);
  //   const status = data?.error?.response?.status || '';
  //   const errorMessage = data?.error?.response?.message || '';
  //   const errorLabel = `Status - ${status} | Error Message - ${errorMessage}`;
  //   setSecurityExceptionLabel(errorLabel);
  // };

  React.useEffect(() => {
    retrieveUserData();
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, userName]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const toggleJwtModal = () => {
    setIsJwtModalVisible(!isJwtModalVisible);
  };

  const renderHeaderRight = () => {
    console.log('renderHeaderRight is called!! ' + userName);
    const label = userName ? 'Logout' : 'Login';
    return (
      <View style={styles.headerRight}>
        <WEButton
          buttonText={label}
          buttonStyle={styles.loginContainer}
          buttonTextStyle={styles.loginText}
          onPress={toggleLoggedState}
        />
        <WEButton
          buttonStyle={styles.loginContainer}
          buttonTextStyle={styles.loginText}
          buttonText={'Info'}
          onPress={() => console.log('TODO - Display info')}
        />
        <WEButton
          buttonStyle={styles.loginContainer}
          buttonTextStyle={styles.loginText}
          buttonText={'JWT'}
          onPress={toggleJwtModal}
        />
      </View>
    );
  };

  const toggleLoggedState = () => {
    if (!userName) {
      toggleModal();
    } else {
      console.log('Logout Success ' + userName);
      webEngageManager.user.logout();
      AsyncStorageUtil.removeItem('userName');
      setUserName('');
    }
  };

  const loginUser = (username: string, password?: string) => {
    console.log('WEModal: Login User ', username);
    if (username) {
      if (password) {
        webEngageManager.user.login(username, password);
        console.log('WEModal: Login With jwt ', username);
      } else {
        webEngageManager.user.login(username);
        console.log('WEModal: Login withoutttt jwt ', username);
      }
      AsyncStorageUtil.setItem('userName', username);
      setUserName(username);
      setSecurityExceptionLabel('');
      console.log('WEModal: Login success ', username);
    } else {
      console.log('WEModal: Login Fails ');
    }
  };

  const updateJWTToken = (jwt: String) => {
    console.log('WEModal: Update jwt token ' + jwt);
    if (userName) {
      webEngageManager.user.setSecureToken(userName, jwt);
    }
    setSecurityExceptionLabel('');
    toggleJwtModal();
  };

  return (
    <ScrollView style={styles.container}>
      {userName && (
        <View>
          <Text style={styles.userName}> Hi {userName},</Text>
          <Text style={styles.errorMessage}>{securityExceptionLabel}</Text>
        </View>
      )}
      <View style={styles.buttonHolder}>
        <WEButton
          buttonText={'Profile'}
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          onPress={() => navigate('Profile')}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Events'}
          onPress={() => navigate('Events')}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Screens'}
          onPress={() => navigate('Screens')}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Inline'}
          onPress={() => navigate('Inline')}
        />
        <WEButton
          buttonText={'App Inbox'}
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          onPress={() => navigate('AppInbox')}
        />

        <WEButton
          buttonText={'Test Events'}
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          onPress={() => webEngageManager.track('Test Event')}
        />
      </View>
      <WEModal
        visible={isModalVisible}
        onClose={toggleModal}
        onLogin={loginUser}
      />

      <WEModal
        visible={isJwtModalVisible}
        isJwtModal
        onClose={toggleJwtModal}
        onPasswordUpdate={updateJWTToken}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
  },
  buttonHolder: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  loginContainer: {
    backgroundColor: COLORS.purple,
  },
  loginText: {
    backgroundColor: COLORS.purple,
    fontSize: 18,
    fontStyle: 'italic',
  },
  headerTextStyle: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: 150,
    height: 50,
    justifyContent: 'center',
    margin: 20,
    borderWidth: 1,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  errorMessage: {
    color: COLORS.error_red,
    fontSize: 12,
    marginHorizontal: 20,
    marginVertical: 10,
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
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    // backgroundColor: '#800080', // Purple color
    borderRadius: 15,
  },
  closeButtonText: {
    // color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    marginRight: 10,
    flexDirection: 'row',
  },
});

export default HomeScreen;
