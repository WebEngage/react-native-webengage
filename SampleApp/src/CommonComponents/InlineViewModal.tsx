import React, {useState} from 'react';
import {Modal, Platform, StyleSheet, Text, View} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import PropTypes from 'prop-types';
import WETextInput from './WETextInput';
import WEButton from './WEButton';
import COLORS from '../Styles/Colors';

interface InlineViewModalProps {
  isModalVisible?: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  addViewListData: (data: any) => void;
}

const InlineViewModal: React.FC<InlineViewModalProps> = ({
  isModalVisible = false,
  setIsModalVisible,
  addViewListData,
}) => {
  const [position, setPosition] = useState<string>('1');
  const [height, setHeight] = useState<string>('100');
  const [width, setWidth] = useState<string>('300');
  const [androidPropertyId, setAndroidPropertyId] = useState<string>('');
  const [iosPropertyId, setIosPropertyId] = useState<string | undefined>();
  const [isCustomView, setIsCustomView] = useState<boolean>(false);

  const addViewData = () => {
    const positionValue = Number(position);
    if (
      !isNaN(positionValue) &&
      positionValue > 0 &&
      androidPropertyId !== '' &&
      iosPropertyId !== undefined
    ) {
      const propertyIdToSave =
        Platform.OS === 'ios' ? parseInt(iosPropertyId, 10) : androidPropertyId;
      console.log(
        'WebEngage: Inline: addViewData: isCustomView - ',
        isCustomView,
      );
      const viewData = {
        position: parseInt(positionValue.toString(), 10) || 0,
        height: parseInt(height, 10) || 0,
        width: parseInt(width, 10) || 0,
        propertyId: propertyIdToSave,
        isCustomView: isCustomView,
      };
      addViewListData(viewData);
    } else {
      setIsModalVisible(false);
      alert('Add valid Data');
    }
  };

  const onCheckBoxClicked = (newValue: boolean) => {
    console.log('WebEngage: Inline: onCheckBoxClicked: ', newValue);
    setIsCustomView(newValue);
  };

  const onPositionChange = (value: string) => {
    setPosition(value);
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}>
        <View style={styles.formView}>
          <View style={styles.modalCard}>
            <Text style={styles.headerTxt}>Add View Data!</Text>
            <View style={styles.ViewLine}>
              <Text>Position: </Text>
              <WETextInput
                customStyle={styles.textViewStyle}
                onChangeText={onPositionChange}
                value={position}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.ViewLine}>
              <Text>Height: </Text>
              <WETextInput
                customStyle={styles.textViewStyle}
                onChangeText={val => setHeight(val)}
                value={height}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.ViewLine}>
              <Text>Width: </Text>
              <WETextInput
                customStyle={styles.textViewStyle}
                onChangeText={val => setWidth(val)}
                value={width}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.ViewLine}>
              <Text> Android PropertyId </Text>
              <WETextInput
                customStyle={styles.textViewStyle}
                onChangeText={val => setAndroidPropertyId(val)}
                value={androidPropertyId}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.ViewLine}>
              <Text> ios PropertyId </Text>
              <WETextInput
                customStyle={styles.textViewStyle}
                onChangeText={val => setIosPropertyId(val)}
                value={iosPropertyId}
                autoCapitalize="none"
              />
            </View>

            <BouncyCheckbox
              size={20}
              fillColor="blue"
              unfillColor="#FFFFFF"
              text="Custom View"
              isChecked={isCustomView}
              style={styles.checkbox}
              onPress={onCheckBoxClicked}
            />

            <WEButton
              buttonText="Add View"
              onPress={addViewData}
              buttonStyle={[styles.button, styles.btnAdd]}
              buttonTextStyle={styles.btnTxt}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formView: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  button: {
    backgroundColor: COLORS.mediumBlue,
    width: 100,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 30,
  },
  btnAdd: {
    alignSelf: 'flex-start',
    backgroundColor: '#0d0306',
    height: 35,
    padding: 0,
  },
  btnTxt: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  modalCard: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
});

export default InlineViewModal;

InlineViewModal.propTypes = {
  isModalVisible: PropTypes.bool,
  setIsModalVisible: PropTypes.func.isRequired,
  addViewListData: PropTypes.func.isRequired,
};
