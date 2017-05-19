import React, { Component } from 'react';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Text, Content, Header, Title, Left, Body, Right, Button, Thumbnail, List, ListItem, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';

import * as music from '../../ducks/music.duck';

class MusicStreet extends Component {
  constructor(props) {
    super(props);

    this.addPlayList = this.addPlayList.bind(this);
    this.renderPlayLists = this.renderPlayLists.bind(this);
  }

  async addPlayList(id) {
    const { MusicActions } = this.props;

    const music = {
      track: this.props.track,
      likes: this.props.likes,
      plays_back: this.props.plays_back,
      artist_url: this.props.artist_url,
      stream_url: this.props.stream_url,
      duration: this.props.duration
    };
    console.log(id);
    if(this.props.isFromSearch) {
      await MusicActions.requestAddMusicToStreet(id, music);
    }
  }

// TODO: 지도 등록할 때 좌표 값 외에 주소도 저장.
  renderPlayLists(data) {
    console.log(data);
    if(data.length == 1) {
      return (
        <ListItem onPress={() => this.addPlayList(data[0]._id)}>
          <Body>
            <Text>{data[0].street_name}</Text>
            <Text note>{data[0].address}</Text>
            <Text note>만든날: 2017.05.04</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.playlist(data[0].music)}>
              <Text>{data[0].music.length}</Text>
              <Icon name="ios-arrow-forward" style={{color: '#c1c1c1'}}/>
            </Button>
          </Right>
        </ListItem>
      )
    }

    return data.map((item, i) => {
      console.log(item._id);
      return (
        <ListItem key={item._id} onPress={() => this.addPlayList(item._id)}>
          <Body>
            <Text>{item.street_name}</Text>
            <Text note>{item.address}</Text>
            <Text note>만든날: 2017.05.04</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.playlist(item.music)}>
              <Text>{item.music.length}</Text>
              <Icon name="ios-arrow-forward" style={{color: '#c1c1c1'}}/>
            </Button>
          </Right>
        </ListItem>
      )
    });
  }

  render() {
    const { renderPlayLists } = this;
    const { myStreets } = this.props;

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Title>음악 거리</Title>
          </Body>
          <Right>
            <Button transparent>
              <Text>편집</Text>
            </Button>
          </Right>
        </Header>
        <Content>
          <List>
            <ListItem onPress={() => Actions.mymusicmap()}>
              <Body>
                <Text>새로운 음악 거리 추가하기</Text>
              </Body>
              <Right>
                <Button transparent>
                  <Icon name="md-add"/>
                </Button>
              </Right>
            </ListItem>
          {renderPlayLists(myStreets)}
          </List>
        </Content>
      </Container>
    );
  }
}

export default connect(
  state => {
    return {
      isLogged: state.auth.authStatus.isLogged,
      myStreets: state.music.myStreets
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestAddMusicToStreet: music.requestAddMusicToStreet
      }, dispatch)
    };
  }
)(MusicStreet);
