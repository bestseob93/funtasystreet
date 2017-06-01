import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Button } from 'native-base';
import { Actions } from 'react-native-router-flux';

class RequiredLogin extends Component {
  render() {
    const { requiredContainer, buttonStyle, buttonText } = style;

    return (
      <View style={requiredContainer}>
        <Text>로그인이 필요한 서비스입니다.</Text>
        <Button style={buttonStyle} onPress={Actions.login}><Text style={buttonText}>로그인 하기</Text></Button>
      </View>
    );
  }
}

const style = {
  requiredContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    marginTop: 15,
    marginBottom: 40,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff'
  }
};

export default RequiredLogin;
