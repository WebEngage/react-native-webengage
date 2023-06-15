import AsyncStorage from '@react-native-async-storage/async-storage';

class AsyncStorageUtil {
  static async storeString(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
      console.log(`Data stored successfully. Key: ${key}, Value: ${value}`);
    } catch (error) {
      console.log(`Failed to store data. Key: ${key}, Value: ${value}`);
    }
  }

  static async getString(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      console.log(`Data retrieved successfully. Key: ${key}, Value: ${value}`);
      return value;
    } catch (error) {
      console.log(`Failed to retrieve data. Key: ${key}`);
      return null;
    }
  }

  static async deleteString(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  static async storeObject(key, value) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`Object stored successfully. Key: ${key}, Value:`, value);
    } catch (error) {
      console.log(`Failed to store object. Key: ${key}, Value:`, value);
    }
  }

  static async getObject(key) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const value = JSON.parse(jsonValue);
      console.log(`Object retrieved successfully. Key: ${key}, Value:`, value);
      return value;
    } catch (error) {
      console.log(`Failed to retrieve object. Key: ${key}`);
      return null;
    }
  }
}

export default AsyncStorageUtil;
