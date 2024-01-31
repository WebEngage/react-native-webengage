import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import WEButton from '../../CommonComponents/WEButton';
import webEngageManager from '../../WebEngageHandler/WebEngageManager';
import CONSTANTS from '../../Utils/Constants';

const ShoppingEventsScreen: React.FC = () => {
  const [tvCheckbox, setTvCheckbox] = useState(true);
  const [mobileCheckbox, setMobileCheckbox] = useState(true);
  const [groceryCheckbox, setGroceryCheckbox] = useState(true);
  const [clothesCheckbox, setClothesCheckbox] = useState(true);
  const [laptopCheckbox, setLaptopCheckbox] = useState(true);

  const buy = () => {
    let selectedProducts = {};

    if (tvCheckbox) {
      selectedProducts = {
        ...selectedProducts,
        Television: {
          ID: '100',
          'Product Name': 'Television',
          Price: 30000.0,
        },
      };
    }
    if (mobileCheckbox) {
      selectedProducts = {
        ...selectedProducts,
        Mobile: {
          ID: '101',
          'Product Name': 'Mobile',
          Price: 1699.5,
        },
      };
    }
    if (groceryCheckbox) {
      selectedProducts = {
        ...selectedProducts,
        grocery: {
          ID: '102',
          'Product Name': 'Grocery',
          Price: 1243.45,
        },
      };
    }
    if (clothesCheckbox) {
      selectedProducts = {
        ...selectedProducts,
        clothes: {
          ID: '103',
          'Product Name': 'Clothes',
          Price: 5450.0,
        },
      };
    }
    if (laptopCheckbox) {
      selectedProducts = {
        ...selectedProducts,
        Laptop: {
          ID: '104',
          'Product Name': 'Laptop',
          Price: 75000.0,
        },
      };
    }

    if (Object.keys(selectedProducts).length > 0) {
      console.log(
        CONSTANTS.WEBENGAGE_SCREEN + 'Order Placed with products:',
        selectedProducts,
      );
      webEngageManager.track('Order Placed', selectedProducts);
    } else {
      console.log(CONSTANTS.WEBENGAGE_SCREEN + 'order placed without products');
      webEngageManager.track('Order Placed');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>
          Select the products you would like to buy
        </Text>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={tvCheckbox}
            onPress={() => setTvCheckbox(!tvCheckbox)}
          />
          <Text style={styles.checkboxText}>Television (Rs. 30000.00)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={mobileCheckbox}
            onPress={() => setMobileCheckbox(!mobileCheckbox)}
          />
          <Text style={styles.checkboxText}>Mobile (Rs. 1699.50)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={groceryCheckbox}
            onPress={() => setGroceryCheckbox(!groceryCheckbox)}
          />
          <Text style={styles.checkboxText}>Grocery (Rs.1243.45)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={clothesCheckbox}
            onPress={() => setClothesCheckbox(!clothesCheckbox)}
          />
          <Text style={styles.checkboxText}>Clothes (Rs. 5450)</Text>
        </View>
        <View style={styles.checkboxContainer}>
          <BouncyCheckbox
            isChecked={laptopCheckbox}
            onPress={() => setLaptopCheckbox(!laptopCheckbox)}
          />
          <Text style={styles.checkboxText}>Laptop (Rs. 75000.00)</Text>
        </View>
      </ScrollView>
      <WEButton buttonText="Buy" onPress={buy} buttonStyle={styles.button} />
    </View>
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
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkboxText: {
    marginLeft: 8,
  },
  button: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    marginBottom: 50,
    height: 40,
    width: 250,
  },
});

export default ShoppingEventsScreen;
