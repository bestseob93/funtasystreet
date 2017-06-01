import React, { Component } from 'react';
import { View, Text, TouchableOpacity, AppState, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import PushNotification from 'react-native-push-notification';
import Swiper from 'react-native-swiper';

import * as auth from '../ducks/auth.duck';
import * as maps from '../ducks/maps.duck';
import * as music from '../ducks/music.duck';

import PushController from './common/PushController';

class First extends Component {
  constructor(props) {
    super(props);

    this.loadInitialStates = this.loadInitialStates.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    this.loadInitialStates();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnMount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  async loadInitialStates() {
    let self = this;
    this.props.AuthActions.checkAuth();
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        const {latitude, longitude} = coords
        self.props.MapsActions.getAddress(latitude, longitude);
        if(self.props.isLogged) {
           self.props.MusicActions.requestUserStreets();
        }
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  
  }

  handleAppStateChange(appState) {

    if(appState === 'background') {
      // console.log('background');
      // PushNotification.localNotificationSchedule({
      //   message: "My Notification Message",
      //   date: new Date(Date.now() + (6 * 1000)) // in 60 secs
      // });
    }
  }

    // geofence.drawCircle(center, radius, points).then((coords) => {
    //  geofence.containsLocation(currentPosition, polygon).then(() => console.log('point in polygon'))
    //                                                     .catch(() => console.log('point is not in polygon'))
    // })
    // geofence.containsLocation(point, polygon)
    //   .then(() => console.log('point is within polygon'))
    //   .catch(() => console.log('point is NOT within polygon'))
    // }

  render() {
    // console.log(this.props.mapStatus.currentAddress + this.props.mapStatus.currentPosition);

    const { container, wrapper, buttonContainer, slide1, slide2, slide3, text, buttonStyle } = styles;
    return (
        <Swiper style={wrapper}>
          <View style={slide1}>
            <Icon name="ios-headset" style={{fontSize: 100, color: '#d93636'}}/>
            <Text style={text}>
              Funtasy Street!
            </Text>
          </View>
          <View style={slide2}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row'}}><Text style={{color: '#ff3f35', fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>노래</Text><Text style={text}>를 검색하고</Text></View>
              <View style={{flexDirection: 'row'}}><Text style={{color: '#ff3f35', fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>음악 거리</Text><Text style={text}>에 담아</Text></View>
              <View style={{flexDirection: 'row'}}><Text style={text}>자신만의 </Text><Text style={{color: '#ff3f35', fontSize: 24, fontWeight: 'bold', marginBottom: 10}}>음악 지도</Text><Text style={text}>를 만드세요!</Text></View>
            </View>
              <TouchableOpacity transparent>
                <PushController/>
              </TouchableOpacity>
          </View>
          <View style={slide3}>
            <Text style={text}>다음에 그 거리에서</Text>
            <Text style={text}>저장했던 노래를 들어봐요</Text>
            <View style={buttonContainer}>
              <TouchableOpacity style={buttonStyle} onPress={() => Actions.login()}>
                <Text style={{color: '#fff'}}>로그인</Text>
              </TouchableOpacity>
              <TouchableOpacity style={buttonStyle} onPress={() => Actions.tabmain({type: 'reset'})}>
                <Text style={{color: '#fff'}}>살피기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Swiper>
    );
  }
}

const styles = {
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#85c8e9',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  buttonStyle: {
    marginBottom: 15,
    backgroundColor: "#f26868",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10
  }
};

export default connect(
  state => {
    return {
      isLogged: state.auth.authStatus.isLogged,
      mapStatus: {
        isFetching: state.maps.request.fetching,
        currentAddress: state.maps.address,
        currentPosition: state.maps.position
      },
      streetStatus: {
        myFetching: state.music.request.myStreets.fetching
      }
    };
  },
  dispatch => {
    return {
      AuthActions: bindActionCreators({
        checkAuth: auth.checkAuthStatus
      }, dispatch),
      MapsActions: bindActionCreators({
        getAddress: maps.getCurrentAddress
      }, dispatch),
      MusicActions: bindActionCreators({
        requestUserStreets: music.requestGetUserStreets
      }, dispatch)
    };
  }
)(First);
