import React from 'react';
import { Spinner } from 'native-base';
import { View } from 'react-native';

const CommonSpinner = () => {
  return (
    <View style={styles.contentContainerStyle}>
      <Spinner color='blue'/>
    </View>
  );
};

const styles = {
  contentContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export { CommonSpinner };
