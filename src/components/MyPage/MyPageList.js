import React, { Component, PropTypes } from 'react';
import {
  Content,
  List,
  ListItem,
  Left,
  Icon,
  Text,
  Right,
  Body,
  Badge,
  Switch
} from 'native-base';
import { Actions } from 'react-native-router-flux';

const propTypes = {
  onLogout: PropTypes.func,
  streetLength: PropTypes.number
};

class MyPageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      falseSwitchIsOn: false
    };
  }

  render() {
    const { onLogout, streetLength } = this.props;

    return (
      <Content>
        <List>
          <ListItem onPress={() => Actions.tabmain({type: 'refresh'})}>
            <Left>
              <Icon name="ios-plane" style={{
                            color: '#0A69FE'
                        }}/>
              <Text>내 음악 지도</Text>
            </Left>
            <Body/>
            <Right>
              <Icon name="ios-arrow-forward"/>
            </Right>
          </ListItem>
          <ListItem onPress={() => Actions.mymusicstreet()}>
            <Left>
              <Icon name="ios-settings-outline"
                    style={{
                      color: '#0A69FE'
                    }}/>
              <Text>내 음악 거리</Text>
            </Left>
            <Body/>
            <Right>
              <Badge style={{
                      backgroundColor: '#000'
                     }}>
                <Text>{streetLength}</Text>
              </Badge>
            </Right>
          </ListItem>
          <ListItem>
            <Left>
              <Icon name="ios-mail-outline"
                    style={{
                      color: '#0A69FE'
                    }}/>
              <Text>회원 정보 수정</Text>
            </Left>
            <Body/>
            <Right>
            </Right>
          </ListItem>
          <ListItem onPress={onLogout}>
            <Left>
              <Icon name="ios-mail-outline"
                    style={{
                      color: '#0A69FE'
                    }}/>
                  <Text>로그아웃</Text>
            </Left>
            <Body/>
          </ListItem>
        </List>
      </Content>
    );
  }
}

MyPageList.propTypes = propTypes;

export default MyPageList;
