// InlineScreen.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const InlineScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Inline Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InlineScreen;
