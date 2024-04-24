import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import InlineViewModal from '../../CommonComponents/InlineViewModal';
import WEButton from '../../CommonComponents/WEButton';
import WETextInput from '../../CommonComponents/WETextInput';
import AsyncStorageUtil from '../../utils/AsyncStorageUtils';
import COLORS from '../../Styles/Colors';

interface ScreenDetailsProps {
  navigation: any;
  route?: any;
}

interface ScreenData {
  size: number;
  screenName: string;
  eventName: string;
  isRecyclerView: boolean;
  viewData: any[];
  screenProperty: string;
  screenValue: string;
  id: number;
}

export default function ScreenDetails(props: ScreenDetailsProps) {
  const {navigation, route = {}} = props;
  const {params = {}} = route;
  const {screenData = {}, isEdit = false, itemIndex = 0} = params;
  const [size, setSize] = useState<string>(screenData?.size || '10');
  const [screenName, setScreenName] = useState<string>(
    screenData?.screenName || '',
  );
  const [eventName, setEventName] = useState<string>(
    screenData?.eventName || '',
  );
  const [screenProperty, setScreenProperty] = useState<string>(
    screenData?.screenProperty || '',
  );
  const [screenValue, setScreenValue] = useState<string>(
    screenData?.screenValue || '',
  );

  const [isRecyclerView, setIsRecyclerView] = useState<boolean>(
    screenData?.isRecyclerView || false,
  );
  const [screenList, setScreenList] = useState<ScreenData[]>([]);
  const [viewData, setViewData] = useState<any[]>(screenData?.viewData || []);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const screenListData = await AsyncStorageUtil.getItem('screenData');
      const screenArrData = JSON.parse(screenListData) || [];
      setScreenList(screenArrData);
    };

    fetchData();
  }, []);

  const onSizeChange = (value: string) => {
    setSize(value);
  };

  const onScreenChange = (value: string) => {
    setScreenName(value);
  };

  const onEventChange = (value: string) => {
    setEventName(value);
  };

  const onScreenPropertyChange = (value: string) => {
    setScreenProperty(value);
  };

  const onScreenValueChange = (value: string) => {
    setScreenValue(value);
  };

  const addScreenDetails = () => {
    const listSize = Number(size);
    if (!isNaN(listSize) && listSize > 0 && screenName) {
      const randomNumber = Math.floor(Math.random() * 1000 + 1);
      const updatedScreenData: ScreenData = {
        size: listSize,
        screenName,
        eventName,
        isRecyclerView,
        viewData,
        screenProperty,
        screenValue,
        id: randomNumber,
      };

      const screenListData = [...screenList];
      const index = screenListData.findIndex(
        item => item.screenName === screenName,
      );

      if (isEdit) {
        if (index === itemIndex) {
          screenListData[itemIndex] = updatedScreenData;
          AsyncStorageUtil.setItem(
            'screenData',
            JSON.stringify(screenListData),
          );
          navigation.goBack();
        } else {
          alert('screen Name already Exists');
        }
      } else {
        if (index !== -1) {
          alert('Screen Already Exists');
        } else {
          screenListData.push(updatedScreenData);
          AsyncStorageUtil.setItem(
            'screenData',
            JSON.stringify(screenListData),
          );
          navigation.goBack();
        }
      }
    }
  };

  const addViewData = () => {
    changeModalVisibility(true);
  };

  const changeModalVisibility = (value: boolean) => {
    setIsModalVisible(value);
  };

  const addViewListData = (data: any) => {
    const viewList = [...viewData];
    let isDuplicate = false;

    for (const viewItem of viewList) {
      if (
        viewItem.propertyId === data.propertyId ||
        viewItem.position === data.position ||
        data.position < 0 ||
        data.propertyId === ''
      ) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      viewList.push(data);
      setViewData(viewList);
    } else {
      alert('Invalid PropertyId||Position');
    }
    setIsModalVisible(false);
  };

  const renderRow = (item: any, index: number) => {
    return Object.entries(item).map(([key, value]) => {
      return (
        <View key={index} style={styles.cardRow}>
          <Text style={styles.cardTitle}> {key}</Text>
          <Text style={styles.cardText}> {value.toString()}</Text>
        </View>
      );
    });
  };

  const deleteView = (index: number) => {
    const viewList = [...viewData];
    viewList.splice(index, 1);
    setViewData(viewList);
  };

  const renderView = (item: any, index: number) => {
    return (
      <View style={styles.cardView}>
        {renderRow(item, index)}
        <WEButton
          buttonText="Delete"
          onPress={() => deleteView(index)}
          buttonStyle={styles.deletebtn}
        />
      </View>
    );
  };

  const viewListDisplay = () => {
    if (viewData.length) {
      return viewData.map((item, index) => {
        return renderView(item, index);
      });
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTxt}>Add Screen Details</Text>
      <View style={styles.form}>
        <View style={styles.ViewLine}>
          <Text>Size: </Text>
          <WETextInput
            customStyle={styles.textViewStyle}
            onChangeText={onSizeChange}
            value={size}
            keyboardType="numeric"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.ViewLine}>
          <Text>Screen Name: </Text>
          <WETextInput
            style={styles.textViewStyle}
            onChangeText={onScreenChange}
            autoCapitalize="none"
            autoCorrect={false}
            value={screenName}
          />
        </View>

        <View style={styles.ViewLine}>
          <Text>Event Name: </Text>
          <WETextInput
            style={styles.textViewStyle}
            onChangeText={onEventChange}
            value={eventName}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.ViewLine}>
          <Text>Screen Property Name: </Text>
          <WETextInput
            style={styles.textViewStyle}
            onChangeText={onScreenPropertyChange}
            value={screenProperty}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.ViewLine}>
          <Text>Screen Value(Number): </Text>
          <WETextInput
            style={styles.textViewStyle}
            onChangeText={onScreenValueChange}
            value={screenValue}
            keyboardType={'numeric'}
            autoCapitalize="none"
          />
        </View>
        <BouncyCheckbox
          size={20}
          fillColor="blue"
          style={styles.checkbox}
          unfillColor="#FFFFFF"
          text="Recycler View"
          isChecked={isRecyclerView}
          onPress={() => setIsRecyclerView(!isRecyclerView)}
        />
        <InlineViewModal
          isModalVisible={isModalVisible}
          setIsModalVisible={changeModalVisibility}
          addViewListData={addViewListData}
        />
        <View style={styles.rowBtn}>
          <WEButton
            buttonText="Add View"
            onPress={addViewData}
            buttonStyle={styles.btnAdd}
            buttonTextStyle={styles.btnText}
          />
          <WEButton
            buttonText="Save Screen"
            onPress={addScreenDetails}
            buttonStyle={styles.btnSave}
            buttonTextStyle={styles.btnText}
          />
        </View>
        {viewListDisplay()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#5e74e0',
    width: 100,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  deletebtn: {
    backgroundColor: COLORS.peach,
    width: 100,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  btnAdd: {
    marginTop: 25,
    alignSelf: 'flex-start',
    backgroundColor: '#0d0306',
    height: 45,
    width: 125,
  },
  btnSave: {
    marginTop: 25,
    alignSelf: 'flex-start',
    backgroundColor: '#1626db',
    height: 45,
    width: 125,
  },
  btnText: {
    padding: 10,
  },
  btnTxt: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTxt: {
    fontSize: 18,
    marginTop: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  ViewLine: {
    marginTop: 30,
  },
  rowLine: {
    flexDirection: 'row',
    marginTop: 30,
  },
  rowBtn: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  textViewStyle: {
    borderBottomWidth: 1,
    width: 300,
    height: 50,
  },
  form: {
    marginTop: 50,
    margin: 20,
  },
  checkbox: {
    width: 100,
    height: 20,
    marginTop: 30,
    justifyContent: 'center',
  },
  cardView: {
    marginTop: 20,
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: '#dbdbdb',
  },
  cardTitle: {
    marginLeft: 25,
    flex: 0.5,
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 15,
  },
  cardRow: {
    flexDirection: 'row',
  },
});
ScreenDetails.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};
