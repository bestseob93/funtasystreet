import React, { Component, PropTypes } from 'react';
import { View, Dimensions, AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as auth from '../../ducks/auth.duck';
import * as music from '../../ducks/music.duck';

import {
    Text,
    Container,
    Header,
    Icon,
    Right,
    Thumbnail
} from 'native-base';
import RequiredLogin from '../Auth/RequiredLogin';
import MyPageList from './MyPageList';

const propTypes = {
  isLogged: PropTypes.bool
};

class MyPage extends Component {

    constructor(props) {
      super(props);

      this.state = {
        falseSwitchIsOn: false
      };

      this.handleLogout = this.handleLogout.bind(this);
      this.clearStorage = this.clearStorage.bind(this);
    }

    async componentDidMount() {
      const { MusicActions, isLogged } = this.props;

      if(isLogged) {
        try {
          await MusicActions.requestUserStreets();
        } catch (e) {
          console.error(e);
        }
      }
    }

    async handleLogout() {
      const { AuthActions } = this.props;
      const { clearStorage, getStorage } = this;
      await AuthActions.requestLogout();

      clearStorage();
    }

    clearStorage = async () => {
      try {
        await AsyncStorage.removeItem('mytoken');
      } catch (error) {
        console.error(error);
      }
    };

    render() {
      const { isLogged, myStreets } = this.props;
      const { handleLogout } = this;
      console.log(myStreets);
        return (
          <View style={{flex:1}}>
          {this.props.isLogged ? (
            <Container>
              <Header style={{backgroundColor: 'transparent', borderBottomColor: 'transparent'}}>
                <Right>
                    <Icon name="ios-settings-outline"/>
                </Right>
              </Header>
              <View style={styles.profileContainer}>
                <Thumbnail style={{width: 150, height: 150, borderRadius: 75}}
                           source={{uri: 'https://i1.sndcdn.com/artworks-000197542718-qyzdxm-t500x500.jpg'}} />
                <Text style={{color: '#000000', paddingTop: 20}}>이환섭 님</Text>
              </View>
              <MyPageList onLogout={handleLogout} streetLength={myStreets.length}/>
            </Container>
          ) : (
            <RequiredLogin/>
          )}
          </View>
        );
    }
}

const styles = {
  profileContainer: {
    width: Dimensions.get('window').width,
    paddingBottom: 20,
    alignItems: 'center'
  }
}

MyPage.propTypes = propTypes;

export default connect(
  state => {
    return {
      isLogged: state.auth.authStatus.isLogged,
      myStreets: state.music.myStreets
    };
  },
  dispatch => {
    return {
      AuthActions: bindActionCreators({
        requestLogout: auth.localLogout
      }, dispatch),
      MusicActions: bindActionCreators({
        requestUserStreets: music.requestGetUserStreets
      }, dispatch)
    }
  }
)(MyPage);
