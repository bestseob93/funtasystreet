import React, { Component } from 'react';
import { View, NativeModules, requireNativeComponent } from 'react-native';

const SwiftStreetView = requireNativeComponent('SwiftStreetView', StreetView);
//const SwiftStreet = NativeModules.SwiftStreetVueManager;
// console.log(SwiftStreetView);
class StreetView extends Component {

  render() {
    const { currentAddress, position } = this.props;
    return (
      <SwiftStreetView coordinate={{latitude: position.lat, longitude: position.lng}}
                       locationLabel={currentAddress}/>
    );
  }
}


const style = {
  container: {
    flex: 1,
    backgroundColor: '#000000'
  }
};

StreetView.propTypes = {
  coordinate: React.PropTypes.object,
  locationLabel: React.PropTypes.string,
  currentAddress: React.PropTypes.string
};


module.exports = StreetView;
