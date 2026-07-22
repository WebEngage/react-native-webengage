import React, {useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  NativeModules,
  Alert,
  Platform,
} from 'react-native';
import {navigate} from '../Navigation/NavigationService';
import WEButton from '../CommonComponents/WEButton';
import WEModal from '../utils/WEModal';
import COLORS from '../Styles/Colors';
import webEngageManager from '../WebEngageHandler/WebEngageManager';
import AsyncStorageUtil from '../utils/AsyncStorageUtils';
import {useIsFocused} from '@react-navigation/native';
import {
  getNotificationCount,
  resetNotificationCount,
} from 'react-native-webengage-inbox';
import CONSTANTS from '../utils/Constants';
import {getArchitectureInfo} from '../utils/ArchitectureDetector';
import {TurboModuleRegistry} from 'react-native';

const {FirebaseTokenModule} = NativeModules;

const HomeScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [isJwtModalVisible, setIsJwtModalVisible] = React.useState(false);
  const [userName, setUserName] = React.useState<string>('');
  const [notificationCount, setNotificationCount] = React.useState(0);
  const secureTokenExpiryListenerRef = useRef();

  const [securityExceptionLabel, setSecurityExceptionLabel] =
    React.useState<string>('');
  const isFocused = useIsFocused();
  const architectureInfo = getArchitectureInfo();

  const retrieveUserData = async () => {
    const data = await AsyncStorageUtil.getItem<string>('userName');

    if (data) {
      const parsedData = JSON.parse(data);
      setUserName(parsedData);
      return parsedData;
    }
    return null;
  };

  const invalidTokenCallback = (data: any) => {
    console.log(
      CONSTANTS.WEBENGAGE_INBOX + 'Invalid token callback ',
      data?.error,
    );
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
          console.log(
            CONSTANTS.WEBENGAGE + 'User Name fetched from local storage:',
            name,
          );
        } else {
          name = userName;
        }

        if (name) {
          fetchNotificationCount();
          secureTokenExpiryListenerRef.current =
            webEngageManager.user.tokenInvalidatedCallback(
              invalidTokenCallback,
            );
        }
      })();
    }
    // comment below code if you want to receive callback across App
    return () => {
      if (secureTokenExpiryListenerRef.current) {
        console.log(
          CONSTANTS.WEBENGAGE + 'Removing secure token expiry listener:',
        );
        secureTokenExpiryListenerRef.current.remove();
      }
    };
  }, [isFocused]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
      title: 'RN-Sample App',
      headerTitleAlign: CONSTANTS.SCREEN_NAMES.HOME,
    });
  }, [navigation, notificationCount, userName]);

  const navigateToInbox = () => {
    resetNotificationCount(); // Resets Notification Counter
    navigation.navigate('NotificationInbox');
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const fetchNotificationCount = async () => {
    try {
      const result = await getNotificationCount();
      console.log(CONSTANTS.WEBENGAGE_INBOX + ' Count result - ' + result);
      setNotificationCount(result);
    } catch (error) {
      console.error(
        CONSTANTS.WEBENGAGE_INBOX + 'Error while fetching notification count',
        error,
      );
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
      console.log(CONSTANTS.WEBENGAGE + 'Logout Success ' + userName);
      webEngageManager.user.logout();
      AsyncStorageUtil.removeItem('userName');
      setUserName('');
    }
  };

  const loginUser = (username: string, password?: string) => {
    if (username) {
      if (password) {
        webEngageManager.user.login(username, password);
        console.log(CONSTANTS.WEBENGAGE_INBOX + 'Login With jwt ', username);
      } else {
        webEngageManager.user.login(username);
        console.log(CONSTANTS.WEBENGAGE_INBOX + 'Login without jwt ', username);
      }
      AsyncStorageUtil.setItem('userName', JSON.stringify(username));
      setUserName(username);
      setSecurityExceptionLabel('');
      console.log(CONSTANTS.WEBENGAGE_INBOX + ' Login success ', username);
    } else {
      console.log(CONSTANTS.WEBENGAGE_INBOX + ' Login Fails ');
    }
  };

  const updateJWTToken = (jwt: string) => {
    console.log(CONSTANTS.WEBENGAGE_INBOX + ' Update jwt token ' + jwt);
    if (userName) {
      webEngageManager.user.setSecureToken(userName, jwt);
    }
    setSecurityExceptionLabel('');
    toggleJwtModal();
  };

  const handleDeleteToken = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Info', 'This feature is only available on Android');
      return;
    }
    try {
      const result = await FirebaseTokenModule.deletePushToken();
      console.log('Delete Push Token:', result);
      Alert.alert('Success', result);
    } catch (error: any) {
      console.error('Delete Push Token Error:', error);
      Alert.alert('Error', error.message || 'Failed to delete push token');
    }
  };

  const handleGenerateToken = async () => {
    if (Platform.OS !== 'android') {
      Alert.alert('Info', 'This feature is only available on Android');
      return;
    }
    try {
      const token = await FirebaseTokenModule.generatePushToken();
      console.log('Generated Push Token:', token);
      Alert.alert('Push Token', token);
    } catch (error: any) {
      console.error('Generate Push Token Error:', error);
      Alert.alert('Error', error.message || 'Failed to generate push token');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.architectureContainer}>
        <Text style={styles.architectureText}>{architectureInfo.displayText}</Text>
      </View>
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
          onPress={() => navigate(CONSTANTS.SCREEN_NAMES.PROFILE)}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Events'}
          onPress={() => navigate(CONSTANTS.SCREEN_NAMES.EVENTS)}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Screens'}
          onPress={() => navigate(CONSTANTS.SCREEN_NAMES.SCREENS)}
        />
        <WEButton
          buttonStyle={styles.buttonContainer}
          buttonTextStyle={styles.buttonText}
          buttonText={'Inline'}
          onPress={() => navigate(CONSTANTS.SCREEN_NAMES.INLINE)}
        />
        <WEButton
          buttonStyle={styles.deleteTokenButton}
          buttonTextStyle={styles.buttonText}
          buttonText={'Delete Token'}
          onPress={handleDeleteToken}
        />
        <WEButton
          buttonStyle={styles.createTokenButton}
          buttonTextStyle={styles.buttonText}
          buttonText={'Create Token'}
          onPress={handleGenerateToken}
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
    width: 200,
    height: 70,
    justifyContent: 'center',
    margin: 30,
    borderWidth: 1,
    borderRadius: 50,
  },
  deleteTokenButton: {
    width: 200,
    height: 70,
    justifyContent: 'center',
    margin: 30,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#d9534f',
  },
  createTokenButton: {
    width: 200,
    height: 70,
    justifyContent: 'center',
    margin: 30,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: '#5cb85c',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 25,
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
    marginBottom: 8,
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
  architectureContainer: {
    backgroundColor: COLORS.purple,
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  architectureText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
