import React, { Component, PropTypes } from 'react';
import {
  Image,
  View
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { DefaultRenderer, Actions } from 'react-native-router-flux';
import Tabs from 'react-native-tabs';
import TabbedView from 'react-native-router-flux/src/TabbedView';
import { deepestExplicitValueForKey } from 'react-native-router-flux/src/Util';
import { MusicBar } from '../components';
import Geofence from './Geofence';

import * as music from '../ducks/music.duck';

class CustomTabBar extends Component {
  watchID: ?number = null;

  componentDidMount() {
    const { myStreets } = this.props;
    let concatedArr = [];
    for(let i = 0; i < myStreets.length; i++ ) {
      concatedArr.push(myStreets[i].circleCoords);
    }
    console.log(concatedArr);
    console.log('----------------');
    console.log(myStreets);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let point = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        console.log(point);
        for(let i = 0; i < concatedArr.length; i++) {
          Geofence.containsLocation(point, concatedArr[i])
            .then(() => this.setPlayList(myStreets[i].music))
            .catch(() => console.log('no way'))
        }

      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      let point = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      console.log(point);
      for(let i = 0; i < concatedArr.length; i++) {
        Geofence.containsLocation(point, concatedArr[i])
          .then(() => this.setPlayList(myStreets[i].music))
          .catch(() => console.log('no way'))
      }
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  static propTypes = {
    navigationState: PropTypes.object,
    tabIcon: PropTypes.any,
    onNavigate: PropTypes.func,
    unmountScenes: PropTypes.bool,
    pressOpacity: PropTypes.number,
    hideOnChildTabs: PropTypes.bool,
  };

  static onSelect(el) {
    if (!Actions[el.props.name]) {
      throw new Error(
        `No action is defined for name=${el.props.name} ` +
        `actions: ${JSON.stringify(Object.keys(Actions))}`);
    }
    if (typeof el.props.onPress === 'function') {
      el.props.onPress();
    } else {
      Actions[el.props.name]();
    }
  }

  constructor(props, context) {
    super(props, context);
    this.renderScene = this.renderScene.bind(this);
    this.setPlayList = this.setPlayList.bind(this);
  }

  async setPlayList(musiclist) {
    console.log(musiclist);
    console.log('cool');
    const { MusicActions } = this.props;
    await MusicActions.requestSetPlayList(musiclist);
  }

  renderScene(navigationState) {
    return (
      <DefaultRenderer
        key={navigationState.key}
        onNavigate={this.props.onNavigate}
        navigationState={navigationState}
      />
    );
  }

  render() {
    const state = this.props.navigationState;
    const selected = state.children[state.index];
    const { musicSelected } = this.props;
    const hideTabBar = this.props.unmountScenes ||
      deepestExplicitValueForKey(state, 'hideTabBar') ||
      (this.props.hideOnChildTabs && deepestExplicitValueForKey(selected, 'tabs'));

    const contents = (
      <Tabs
        style={state.tabBarStyle}
        selectedIconStyle={state.tabBarSelectedItemStyle}
        iconStyle={state.tabBarIconContainerStyle}
        onSelect={CustomTabBar.onSelect} {...state}
        selected={selected.sceneKey}
        pressOpacity={this.props.pressOpacity}
      >
        {state.children.filter(el => el.icon || this.props.tabIcon).map((el) => {
          const Icon = el.icon || this.props.tabIcon;
          return <Icon {...this.props} {...el} />;
        })}
      </Tabs>
    );
    return (
      <View
        style={{ flex: 1 }}
      >
        <TabbedView
          navigationState={this.props.navigationState}
          style={{ flex: 1 }}
          renderScene={this.renderScene}
        />
      <MusicBar thisMusic={musicSelected} nowPlayList={this.props.nowPlayList}/>
        {!hideTabBar && state.children.filter(el => el.icon).length > 0 &&
          (state.tabBarBackgroundImage ? (
            <Image source={state.tabBarBackgroundImage}>
              {contents}
            </Image>
          ) : contents)
        }
      </View>
    );
  }

}

export default  connect(
  state => {
    return {
      musicSelected: state.music.selectedMusic,
      myStreets: state.music.myStreets,
      nowPlayList: state.music.nowPlayList
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestSetPlayList: music.requestSetPlayList
      }, dispatch)
    };
  }
)(CustomTabBar);
