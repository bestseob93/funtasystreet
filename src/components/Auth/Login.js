import React, { Component, PropTypes } from 'react';
import { View, Image } from 'react-native';
import { Container, Toast, Content, Form, Title, Item, Input, Button, Text, Header, Left, Body, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CommonSpinner } from '../common';

import * as auth from '../../ducks/auth.duck';

const propTypes = {
  AuthActions: PropTypes.object,
  isFetching: PropTypes.bool
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      useremail: '',
      password: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  async onSubmit() {
    const { AuthActions, unAuth } = this.props;

    try {
      await AuthActions.requestLogin(this.state.useremail, this.state.password);
    } catch (e) {
        Toast.show({
                text: '계정이나 비밀번호를 확인해주세요',
                position: 'bottom',
                buttonText: 'Okay',
                type: 'danger'
              });
    }
  }

  renderButton() {
    const { authStyle } = styles;
    const { isFetching } = this.props;
    const { onSubmit } = this;

    if(isFetching) {
      return <CommonSpinner/>;
    }

    return (
      <Button style={authStyle} onPress={onSubmit}>
        <Text>로그인</Text>
      </Button>
    );
  }

  render() {
    const { logoContainer, inputContainer, authStyle, joinStyle, buttonContainer } = styles;
    const { renderButton } = this;

    console.log(this.props);
    return (
      <Container>
          <Content>
            <Header>
              <Left>
                <Button transparent onPress={Actions.pop}>
                  <Icon name="arrow-back" style={{color: '#a2a2a2'}}/>
                </Button>
            </Left>
            <Body>
                <Title>로그인</Title>
            </Body>
            <Right>
                <Button transparent>
                </Button>
            </Right>
            </Header>
            <View style={logoContainer}>
              <Image style={{width:100, height:100}} source={require('../common/funtasy_street_logo/funtasy_street_logo_2.png')}/>
              <Text>Funtasy Street</Text>
            </View>
              <Form style={{paddingLeft: 10, paddingRight: 10}}>
                  <View style={inputContainer}>
                    <Icon active name="md-person" style={{paddingLeft: 15, flex: 1, fontSize: 15}} />
                    <Input value={this.state.useremail}
                           autoCorrect={false}
                           onChangeText={text => this.setState({ useremail: text})}
                           placeholder="youremail@gmail.com"
                           style={{flex: 8}} />
                  </View>
                  <View style={inputContainer}>
                    <Icon active name="md-lock" style={{paddingLeft: 15, flex: 1, fontSize: 15}} />
                    <Input value={this.state.password}
                           autoCorrect={false}
                           onChangeText={password => this.setState({ password })}
                           secureTextEntry={true}
                           placeholder="Password"
                           style={{flex: 8}} />
                  </View>
                  <View style={buttonContainer}>
                    { renderButton() }
                  </View>
                  <View style={buttonContainer}>
                    <Button style={joinStyle} bordered onPress={Actions.register}>
                      <Text>회원가입</Text>
                    </Button>
                    <Button style={authStyle} bordered>
                      <Text>비밀번호 찾기</Text>
                    </Button>
                  </View>
              </Form>
          </Content>
      </Container>
    );
  }
}

const styles = {
  logoContainer: {
    flex: 1,
    paddingVertical: 25,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#dc98f7',
    borderRadius: 5
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  authStyle: {
    marginTop: 15,
    flex: 1,
    justifyContent: 'center'
  },
  joinStyle: {
    marginTop: 15,
    flex: 1,
    marginRight: 5,
    justifyContent: 'center'
  }
}

Login.propTypes = propTypes;

export default connect(
  state => {
    return {
      isFetching: state.auth.request.fetching
    };
  },
  dispatch => {
    return {
      AuthActions: bindActionCreators({
        requestLogin: auth.localLogin
      }, dispatch)
    };
  }
)(Login);
