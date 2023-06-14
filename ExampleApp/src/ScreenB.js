import {Button, View} from 'react-native';
import React from 'react';

const ScreenB = ({navigation}) => {
  return (
    <View>
      <Button
        title="Go to ScreenA"
        onPress={() => navigation.navigate('ScreenA')}
      />
    </View>
  );
};
export default ScreenB;
