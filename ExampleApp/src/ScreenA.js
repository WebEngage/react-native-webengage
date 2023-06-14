import {Button, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ScreenA = ({navigation}) => {
  return (
    <View>
      <Button
        title="Go to ScreenB"
        onPress={() => navigation.navigate('ScreenB')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default ScreenA;

const styles = StyleSheet.create({});
