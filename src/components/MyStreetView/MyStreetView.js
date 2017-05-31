import React, { Component } from 'react';
import { Dimensions, Text, View, AsyncStorage } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { StreetView } from '../../components';

class MyStreetView extends Component {

  render() {
    const { mapStatus } = this.props;
    return (
      <View style={{flex: 1}}>
        <View style={styles.streetBox}>
          <Text>seongbuk gu</Text>
        </View>
        <View style={{zIndex: -1}}>
          <StreetView currentAddress={mapStatus.currentAddress} position={mapStatus.position}/>
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
        currentAddress: state.maps.address,
        position: state.maps.position
      }
    };
  },
  null
)(MyStreetView);
