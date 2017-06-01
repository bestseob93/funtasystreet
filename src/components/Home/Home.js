import React, { Component } from 'react';
import { Dimensions, Text, ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import MyStreetMap from './MyStreetMap';

import * as music from '../../ducks/music.duck';
import * as maps from '../../ducks/maps.duck';

class Home extends Component {

  async componentDidMount() {
    const { MusicActions, isLogged } = this.props;

    if(isLogged) {
      try {
        await MusicActions.requestUserStreets();
        await MusicActions.requestWholeStreets();
      } catch (e) {
        console.error(e);
      }
    }
  }

  render() {
    // console.log('home');
    // console.log(this.props);
    const { onRegionChange } = this;
    const { myStreets, wholeStreets, position, MapsActions } = this.props;

    return (
      <ScrollView
        style={{marginBottom: 100}}>
        <MyStreetMap myStreets={myStreets} position={position} MapsActions={MapsActions}/>
      </ScrollView>
    );
  }
}

export default connect(
  state => {
    return {
      myStreets: state.music.myStreets,
      wholeStreets: state.music.wholeStreets,
      isLogged: state.auth.authStatus.isLogged,
      position: state.maps.position
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestUserStreets: music.requestGetUserStreets,
        requestWholeStreets: music.requestGetWholeStreets
      }, dispatch),
      MapsActions: bindActionCreators({
        requestCompareStreet: maps.requestCompareStreet
      })
    };
  }
)(Home);
