import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {navigate} from '../Navigation/NavigationService';
import WEButton from '../CommonComponents/WEButton';
import WEModal from '../Utils/WEModal';
import COLORS from '../Styles/Colors';
import webEngageManager from '../WebEngageHandler/WebEngageManager';
import AsyncStorageUtil from '../Utils/AsyncStorageUtils';
import {useIsFocused} from '@react-navigation/native';
import {
  getNotificationCount,
  resetNotificationCount,
} from 'react-native-webengage-inbox';

// TODO Add Navigation Type
const HomeScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isJwtModalVisible, setIsJwtModalVisible] = React.useState(false);
  const [userName, setUserName] = React.useState<string>('');
  const [notificationCount, setNotificationCount] = React.useState(0);
  const secureTokenExpiryListenerRef = useRef();

  const [securityExceptionLabel, setSecurityExceptionLabel] =
    React.useState<string>('');
  const isFocused = useIsFocused();

  const retrieveUserData = async () => {
    const data = await AsyncStorageUtil.getItem<string>('userName');
    console.log('Retrieved Data:', data);

    if (data) {
      setUserName(data);
      return data;
    }
    return null;
  };

  const invalidTokenCallback = (data: any) => {
    console.log('WebEngage: Inbox: Invalid token callback ', data.error);
    const status = data?.error?.response?.status || '';
    const errorMessage = data?.error?.response?.message || '';
    const errorLabel = `Status - ${status} | Error Message - ${errorMessage}`;
    setSecurityExceptionLabel(errorLabel);
  };

  // Get user name When screen is focused
  React.useEffect(() => {
    if (isFocused) {
      (async () => {
        let name = null;
        if (!userName) {
          name = await retrieveUserData();
        } else {
          name = userName;
        }
        console.log('WebEngage: Inbox: userName - ' + name);

        if (name) {
          fetchNotificationCount();
          secureTokenExpiryListenerRef.current =
            webEngageManager.user.tokenInvalidatedCallback(
              invalidTokenCallback,
            );
        }
      })();
      console.log('WebEngage: Inbox: updating render header -------->');
    }
    return () => {
      if (secureTokenExpiryListenerRef.current) {
        secureTokenExpiryListenerRef.current.remove();
      }
    };
  }, [isFocused]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
    });
  }, [navigation, notificationCount, userName]);

  const navigateToInbox = () => {
    // TODO - enable this later
    // resetNotificationCount(); // Resets Notification Counter
    navigation.navigate('NotificationInbox');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchNotificationCount = async () => {
    try {
      console.log('WebEngage: Inbox: Fetching notification Count - ');

      const result = await getNotificationCount();
      console.log('WebEngage: Inbox: Count result - ' + result);
      setNotificationCount(result);
    } catch (error) {
      console.error('Error while fetching notification count', error);
    }
  };

  const toggleJwtModal = () => {
    setIsJwtModalVisible(!isJwtModalVisible);
  };

  const renderNotificationIcon = () => {
    const notificationImageSource = require('../Assets/images/notification.png');
    const shouldRenderNotificationCounter = notificationCount > 0;

    return (
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={navigateToInbox}>
        <Image
          source={notificationImageSource}
          style={styles.notificationIcon}
        />
        {shouldRenderNotificationCounter && (
          <View style={styles.notificationCounter}>
            <Text style={styles.notificationCounterText}>
              {notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
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
        <View>{renderNotificationIcon()}</View>
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
    console.log('WebEngage: Inbox: Login User ', username);
    if (username) {
      if (password) {
        webEngageManager.user.login(username, password);
        console.log('WebEngage: Inbox: Login With jwt ', username);
      } else {
        webEngageManager.user.login(username);
        console.log('WebEngage: Inbox: Login withoutttt jwt ', username);
      }
      AsyncStorageUtil.setItem('userName', username);
      setUserName(username);
      setSecurityExceptionLabel('');
      console.log('WebEngage: Inbox: Login success ', username);
    } else {
      console.log('WebEngage: Inbox: Login Fails ');
    }
  };

  const updateJWTToken = (jwt: String) => {
    console.log('WebEngage: Inbox: Update jwt token ' + jwt);
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
          onPress={() => navigate('customScreens')}
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
    marginLeft: 10,
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
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  notificationCounter: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 5,
    position: 'absolute',
    top: 5,
    right: 2,
  },
  notificationCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationIcon: {
    borderColor: '#000',
    height: 50,
    width: 50,
  },
});

export default HomeScreen;
