import AsyncStorage from '@react-native-async-storage/async-storage';
import CONSTANTS from './Constants';

interface AsyncStorageUtil {
  setItem: (key: string, value: any) => Promise<void>;
  getItem: <T>(key: string) => Promise<T | null>;
  removeItem: (key: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const AsyncStorageUtil: AsyncStorageUtil = {
  // Add item to AsyncStorage
  setItem: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(CONSTANTS.WEBENGAGE + 'AsyncStorage setItem error:', error);
    }
  },

  // Get item from AsyncStorage
  getItem: async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error) {
      console.error(
        CONSTANTS.WEBENGAGE + ' AsyncStorage getItem error:',
        error,
      );
      return null;
    }
  },

  // Remove item from AsyncStorage
  removeItem: async key => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(
        CONSTANTS.WEBENGAGE + ' AsyncStorage removeItem error:',
        error,
      );
    }
  },

  // Clear all items from AsyncStorage
  clearAll: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error(
        CONSTANTS.WEBENGAGE + ' AsyncStorage clearAll error:',
        error,
      );
    }
  },
};

export default AsyncStorageUtil;
