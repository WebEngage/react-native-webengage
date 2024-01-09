import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import WebEngage from 'react-native-webengage';

function App(): React.JSX.Element {
  const webengage = new WebEngage();
  webengage.user.login('12345');
  return (
    <SafeAreaView style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}> Welcome To WebEngage </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    borderWidth: 1,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
