import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
// import {ScreenNamesContext} from '../Navigation';
import {navigate} from '../../Navigation/NavigationService';
import webEngageManager from '../../WebEngageHandler/WebEngageManager';
import WEButton from '../../CommonComponents/WEButton';
import COLORS from '../../Styles/Colors';
import AsyncStorageUtil from '../../utils/AsyncStorageUtils';
import CONSTANTS from '../../utils/Constants';

interface ScreenItem {
  size: number;
  screenName: string;
  eventName: string;
  isRecyclerView: boolean;
  viewData: Array<{
    position: number;
    height?: number;
    width?: number;
    propertyId: string;
    isCustomView: boolean;
  }>;
  screenProperty: string;
  screenValue: string;
  id: number;
}

interface ScreenListProps {
  navigation: any;
}

const defaultScreenData: ScreenItem = {
  size: 10,
  screenName: 'screen1',
  eventName: '',
  isRecyclerView: false,
  viewData: [
    {
      position: 1,
      height: 100,
      width: 300,
      propertyId: 'S1P1',
      isCustomView: false,
    },
  ],
  screenProperty: '',
  screenValue: '',
  id: 24,
};

const ScreenList: React.FC<ScreenListProps> = ({navigation}) => {
  const [screenList, setScreenList] = useState<ScreenItem[]>([]);

  const addScreen = () => {
    navigation.navigate(CONSTANTS.SCREEN_NAMES.SCREEN_DETAILS);
  };

  useEffect(() => {
    webEngageManager.screen('custom');
    const unsubscribe = navigation.addListener('focus', async () => {
      const screenData = await AsyncStorageUtil.getItem('screenData');
      const screenLists: ScreenItem[] = JSON.parse(screenData);
      // screenLists.unshift(defaultScreenData);
      console.log('WebEngage: screenData - ', screenData);
      setScreenList(screenLists);
    });
    return unsubscribe;
  }, [navigation]);

  const removeScreenData = (index: number) => {
    const screenListData = [...screenList];
    screenListData.splice(index, 1);
    setScreenList(screenListData);
    AsyncStorageUtil.setItem('screenData', JSON.stringify(screenListData));
  };

  const openScreen = (item: ScreenItem) => {
    navigate(CONSTANTS.SCREEN_NAMES.DYNAMIC_SCREEN, {
      item,
      screenId: item.screenName,
    });
  };

  const editScreen = (item: ScreenItem, index: number) => {
    navigation.navigate(CONSTANTS.SCREEN_NAMES.SCREEN_DETAILS, {
      screenData: item,
      isEdit: true,
      itemIndex: index,
    });
  };

  const renderItem = ({item, index}: {item: ScreenItem; index: number}) => {
    return (
      <View style={styles.item}>
        <View style={styles.itemRow}>
          <View style={styles.row}>
            <Text style={styles.textView}>Screen Name</Text>
            <Text style={styles.itemText}>{item.screenName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.textView}>Size</Text>
            <Text style={styles.itemText}>{item.size}</Text>
          </View>

          <View style={styles.row}>
            {item.isRecyclerView ? (
              <Text style={[styles.itemText, styles.redText]}>
                RecyclerView
              </Text>
            ) : (
              <Text style={[styles.itemText, styles.blueText]}>
                Regular View
              </Text>
            )}
          </View>
        </View>
        <View style={styles.buttonCol}>
          <WEButton
            buttonText="Open"
            onPress={() => openScreen(item)}
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.open}
          />
          <WEButton
            buttonText="Edit"
            onPress={() => editScreen(item, index)}
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.edit}
          />
          <WEButton
            buttonText="Remove"
            onPress={() => removeScreenData(index)}
            buttonStyle={styles.buttonStyle}
            buttonTextStyle={styles.removeText}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <WEButton
        buttonText="Add Screen"
        onPress={addScreen}
        buttonStyle={styles.button}
        buttonTextStyle={styles.btnTxt}
      />

      <View style={styles.container}>
        <Text style={styles.headerTxt}> List of Screens Added </Text>
      </View>

      <FlatList
        data={screenList}
        style={styles.flatlistStyle}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlistStyle: {
    height: '100%',
  },
  button: {
    backgroundColor: '#5e74e0',
    width: 200,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
    padding: 0,
  },
  btnTxt: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 0,
  },
  headerTxt: {
    fontSize: 18,
    marginTop: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    marginTop: 20,
    paddingLeft: 20,
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: '#dbdbdb',
    flexDirection: 'row',
    flex: 1,
  },
  itemRow: {
    flex: 0.9,
  },
  buttonCol: {
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowView: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
  },
  textView: {
    width: 100,
  },
  itemText: {
    fontWeight: 'bold',
    width: 120,
  },
  redText: {
    color: '#ff0000',
  },
  blueText: {
    color: '#00FF',
  },
  buttonStyle: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
    marginTop: 10,
  },
  open: {
    color: COLORS.white,
  },
  edit: {
    color: COLORS.grey,
  },
  removeText: {
    color: COLORS.grey,
  },
});
export default ScreenList;
