import React, { Component } from 'react';
import { View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Text, Content, Header, Title, Left, Body, Right, Button, List, ListItem, Icon } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

import * as music from '../../ducks/music.duck';

class MusicStreet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDeleted: false
    };

    this.addPlayList = this.addPlayList.bind(this);
    this.renderPlayLists = this.renderPlayLists.bind(this);
  }

  async componentWillReceiveProps(nextProps) {
    if(this.props.isDeleted !== nextProps.isDeleted) {
      const { MusicActions } = this.props;
      await MusicActions.requestGetUserStreets();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(nextProps);
    if(this.props.isDeleted !== nextProps.isDeleted) {
      return nextProps.isDeleted;
    } else {
      return false;
    }
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

  toPlayList() {
    Actions.playlist({ music: data[0].music, streetId: data[0]._id, streetIndex: i, onDelete: MusicActions.requestDeleteMusic });
  }

// TODO: 지도 등록할 때 좌표 값 외에 주소도 저장.
  renderPlayLists(data) {
    console.log('renderplaylist');
    console.log(typeof data);
    const { MusicActions } = this.props;

    if(data.length === 1) {
      return (
        <ListItem onPress={() => this.addPlayList(data[0]._id)}>
          <Body>
            <Text>{data[0].street_name}</Text>
            <Text note>{data[0].address}</Text>
            <Text note>{data[0].date.created}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.toPlayList()}>
              <Text>{item.music.length}</Text>
              <Icon name="ios-arrow-forward" style={{color: '#c1c1c1'}}/>
            </Button>
          </Right>
        </ListItem>
      );
    }

    return data.map((item, i) => {
      console.log(item._id);
      console.log(i);
      console.log('mapping');
      return (
        <ListItem key={item._id} onPress={() => this.addPlayList(item._id)}>
          <Body>
            <Text>{item.street_name}</Text>
            <Text note>{item.address}</Text>
            <Text note>{item.date.created}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.playlist({ music: item.music, streetId: item._id, streetIndex: i, onDelete: MusicActions.requestDeleteMusic })}>
              <Text>{item.music.length}</Text>
              <Icon name="ios-arrow-forward" style={{color: '#c1c1c1'}}/>
            </Button>
          </Right>
        </ListItem>
      )
    });
  }

  render() {
    const { renderPlayLists, backTo } = this;
    const { myStreets } = this.props;
    console.log('render part');
    console.log(typeof myStreets);
    console.log(this.nextProps);
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
            <ListItem>
              <Body>
                <Text note>현재 음악 거리에서만 음악을 재생할 수 있습니다.</Text>
              </Body>
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
      myStreets: state.music.myStreets,
      nowPlayList: state.music.nowPlayList
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestAddMusicToStreet: music.requestAddMusicToStreet,
        requestDeleteMusic: music.requestDeleteMusic,
        requestGetUserStreets: music.requestGetUserStreets
      }, dispatch)
    };
  }
)(MusicStreet);
