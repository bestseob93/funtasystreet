import React, { Component } from 'react';
import { Dimensions, Text, View, AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { StreetView } from '../../components';

import * as maps from '../../ducks/maps.duck';

class Home extends Component {
  constructor(props) {
    super(props);

    this._loadInitialState = this._loadInitialState.bind(this);
  }

  componentDidMount() {
    this._loadInitialState();
  }

  async _loadInitialState() {
    try {
      var valueToken = await AsyncStorage.getItem('mytoken');
      if (valueToken !== null) {
        console.log(valueToken);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={styles.streetBox}>
          <Text>seongbuk gu</Text>
        </View>
        <View style={{zIndex: 10}}>
          <StreetView currentAddress={this.props.mapStatus.currentAddress}/>
        </View>
      </View>
    );
  }
}

const styles = {
  streetBox: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 30,
    backgroundColor: 'rgba(32, 199, 238, 5)',
    borderRadius: 5
  }
};
export default connect(
  state => {
    return {
      mapStatus: {
        currentAddress: state.maps.address
      }
    };
  },
  null
)(Home);
