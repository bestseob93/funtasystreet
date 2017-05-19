import React, { Component } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import WholeStreetMap from './WholeStreetMap';
import MyStreetMap from './MyStreetMap';

import * as music from '../../ducks/music.duck';

class MapSearch extends Component {

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
      <ScrollableTabView
        style={{marginTop: 30}}>
        <WholeStreetMap tabLabel="모두의 음악 지도" wholeStreets={wholeStreets}/>
        <MyStreetMap tabLabel="내 음악 지도" myStreets={myStreets}/>
      </ScrollableTabView>
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
)(MapSearch);
