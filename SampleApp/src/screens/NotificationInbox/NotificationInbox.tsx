import React, {FC, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import Spinner from 'react-native-loading-spinner-overlay';
import HeaderMoreButton from './HeaderMoreButton';
import WEButton from '../../CommonComponents/WEButton';
import {
  getNotificationList,
  readAll,
  unReadAll,
  deleteAll,
  markRead,
  markUnread,
  markDelete,
  trackClick,
  trackView,
} from 'react-native-webengage-inbox';
import CONSTANTS from '../../Utils/Constants';

interface Notification {
  status: string;
  message: {
    title: string;
    message: string;
  };
  experimentId: string;
}

interface NotificationInboxProps {
  navigation: any;
}

const READ = 'READ';
const UNREAD = 'UNREAD';

const NotificationInbox: FC<NotificationInboxProps> = ({navigation}) => {
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [hasNextData, setHasNextData] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get Initial Notification List
  useEffect(() => {
    fetchNotificationList();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderMoreButton toggleMenu={toggleMenu} />,
    });
  }, [navigation]);

  // 5s Timer for Loader fallback
  useEffect(() => {
    if (isLoading) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading]);

  const fetchNotificationList = async () => {
    setIsLoading(true);
    try {
      const result = await getNotificationList();
      notificationListSuccess(result);
    } catch (error) {
      notificationListFailure(error);
    }
  };

  const fetchNextList = async () => {
    console.log(CONSTANTS.WEBENGAGE_INBOX + ' Fetching Next List');
    setIsLoading(true);
    if (notificationList.length) {
      const offset = notificationList[notificationList.length - 1];
      try {
        const result = await getNotificationList(offset);
        notificationListSuccess(result);
      } catch (error) {
        notificationListFailure(error);
      }
    } else {
      console.log(CONSTANTS.WEBENGAGE_INBOX + ' NotificationList is empty');
    }
  };

  const markAllRead = () => {
    readAll(notificationList);
    toggleMenu();
    const updatedNotificationList = notificationList.map(notification => {
      if (notification.status !== READ) {
        return {
          ...notification,
          status: READ,
        };
      }
      return notification;
    });
    setNotificationList(updatedNotificationList);
  };

  const markAllUnRead = () => {
    unReadAll(notificationList);
    toggleMenu();
    const updatedNotificationList = notificationList.map(notificationItem => {
      if (notificationItem.status !== UNREAD) {
        return {
          ...notificationItem,
          status: UNREAD,
        };
      }
      return notificationItem;
    });
    setNotificationList(updatedNotificationList);
  };

  const deleteAllItems = () => {
    deleteAll(notificationList);
    setNotificationList([]);
    toggleMenu();
  };

  const changeStatus = (
    notificationItem: Notification,
    notificationIndex: number,
  ) => {
    const newNotificationList = [...notificationList];
    let notificationItemCopy = {...notificationItem};
    if (notificationItem.status === 'UNREAD') {
      markRead(notificationItem);
      notificationItemCopy.status = 'READ';
    } else {
      const newNotificationItem = {...notificationItem};
      markUnread(newNotificationItem);
      notificationItemCopy.status = 'UNREAD';
    }
    newNotificationList[notificationIndex] = notificationItemCopy;
    setNotificationList(newNotificationList);
  };

  const deleteItem = (
    notificationItem: Notification,
    notificationIndex: number,
  ) => {
    const newNotificationList = [...notificationList];
    newNotificationList.splice(notificationIndex, 1);
    setNotificationList(newNotificationList);
    markDelete(notificationItem);
  };

  const trackButtonClick = (notificationItem: Notification) => {
    trackClick(notificationItem);
    Alert.alert('Click Tracked for ' + notificationItem?.experimentId);
  };

  const trackViewItem = (notificationItem: Notification) => {
    trackView(notificationItem);
    Alert.alert('View Tracked for ' + notificationItem?.experimentId);
  };

  const displayMessageList = () => {
    if (notificationList.length) {
      return notificationList.map((notificationItem, notificationIndex) => {
        const {status = '', message = {}, experimentId = ''} = notificationItem;
        const {title = '', message: description = ''} = message;

        return (
          <View style={styles.messageItem} key={notificationIndex}>
            <Text style={styles.messageTitle}>Title - {title}</Text>
            <Text style={styles.messageTitle}>Description - {description}</Text>
            <Text style={styles.messageTitle}>
              Experiment ID - {experimentId}
            </Text>
            <Text style={styles.messageStatus}>Status - {status}</Text>
            <View style={styles.buttonsHolder}>
              <WEButton
                onPress={() =>
                  changeStatus(notificationItem, notificationIndex)
                }
                buttonStyle={styles.statusButton}
                buttonTextStyle={styles.buttonText}
                buttonText={status === 'UNREAD' ? READ : UNREAD}
              />
              <WEButton
                onPress={() => trackButtonClick(notificationItem)}
                buttonStyle={styles.statusButton}
                buttonTextStyle={styles.buttonText}
                buttonText={'Track Click'}
              />
              <WEButton
                onPress={() => trackViewItem(notificationItem)}
                buttonStyle={styles.statusButton}
                buttonTextStyle={styles.buttonText}
                buttonText={'Track View'}
              />
              <WEButton
                onPress={() => deleteItem(notificationItem, notificationIndex)}
                buttonStyle={styles.statusButton}
                buttonTextStyle={styles.buttonText}
                buttonText={'Delete Item'}
              />
            </View>
          </View>
        );
      });
    } else {
      return (
        <View style={styles.noMessageContainer}>
          <Text style={styles.noMessage}>No Message Available to Display</Text>
        </View>
      );
    }
  };

  // Success and Error callbacks for List
  const notificationListSuccess = (data: any) => {
    console.log(
      CONSTANTS.WEBENGAGE_INBOX + ' notificationListSuccess  -  ' + data,
    );
    setIsLoading(false);
    const {messageList = [], hasNext = true} = data;
    setNotificationList([...notificationList, ...messageList]);
    setHasNextData(hasNext);
  };

  const notificationListFailure = (err: any) => {
    CONSTANTS.WEBENGAGE_INBOX +
      ' notificationListFailure  -  ' +
      JSON.stringify(err),
      setIsLoading(false);

    console.error(
      CONSTANTS.WEBENGAGE_INBOX + ' Error while fetching notification list',
      err,
    );
  };

  const showHasNext = () => {
    if (notificationList.length) {
      return hasNextData ? (
        fetchMoreButton()
      ) : (
        <Text style={styles.noMessage}>End of the List</Text>
      );
    }
  };

  const fetchMoreButton = () => {
    return (
      <WEButton
        onPress={fetchNextList}
        buttonText={'Fetch More'}
        buttonStyle={styles.button}
        buttonTextStyle={styles.buttonText}
      />
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(prevIsMenuOpen => !prevIsMenuOpen);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isMenuOpen && (
        <View style={styles.menuButtons}>
          <WEButton
            onPress={markAllRead}
            buttonText={'Read All'}
            buttonStyle={styles.button}
            buttonTextStyle={styles.buttonText}
          />
          <WEButton
            onPress={markAllUnRead}
            buttonText={'Unread All'}
            buttonStyle={styles.button}
            buttonTextStyle={styles.buttonText}
          />
          <WEButton
            onPress={deleteAllItems}
            buttonText={'Delete All'}
            buttonStyle={styles.button}
            buttonTextStyle={styles.buttonText}
          />
        </View>
      )}
      <ImageBackground
        source={require('../../Assets/images/NI_background.jpg')}
        style={styles.imageBackground}>
        <ScrollView>
          <View style={styles.adjustContainer}>
            {displayMessageList()}
            {showHasNext()}
          </View>
        </ScrollView>
      </ImageBackground>
      <Spinner
        visible={isLoading}
        textContent={'Loading...'}
        textStyle={styles.spinnerStyle}
      />
    </SafeAreaView>
  );
};

const HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  adjustContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#A782E4',
    padding: 10,
    width: 125,
    margin: 10,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logout: {
    alignItems: 'center',
    backgroundColor: '#7F5A58',
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logoutHolder: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
  },
  spinnerStyle: {color: '#FFF'},
  counter: {
    fontSize: 20,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  actionButtonsHolder: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
  },
  messageItem: {
    width: '100%',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageStatus: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonsHolder: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMessageContainer: {
    marginTop: HEIGHT / 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMessage: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  menuIcon: {
    paddingHorizontal: 10,
    flex: 1,
    alignItems: 'flex-end',
  },
  menuButtons: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#dbd3e3',
    padding: 10,
    borderRadius: 5,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  moreIcon: {
    height: 40,
    width: 40,
  },
});
NotificationInbox.propTypes = {
  navigation: PropTypes.object.isRequired,
};

NotificationInbox.defaultProps = {
  navigation: {},
};

export default NotificationInbox;
