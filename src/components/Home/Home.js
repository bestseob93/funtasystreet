import React, { Component } from 'react';
import { Dimensions, Text, ScrollView } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import MyStreetMap from './MyStreetMap';

import * as music from '../../ducks/music.duck';

class Home extends Component {

  async componentDidMount() {
    const { MusicActions } = this.props;

    try {
      await MusicActions.requestUserStreets();
      await MusicActions.requestWholeStreets();
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { onRegionChange } = this;
    const { myStreets, wholeStreets } = this.props;

    return (
      <ScrollView
        style={{marginBottom: 100}}>
        <MyStreetMap myStreets={myStreets}/>
      </ScrollView>
    );
  }
}

export default connect(
  state => {
    return {
      myStreets: state.music.myStreets,
      wholeStreets: state.music.wholeStreets
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestUserStreets: music.requestGetUserStreets,
        requestWholeStreets: music.requestGetWholeStreets
      }, dispatch)
    };
  }
)(Home);
