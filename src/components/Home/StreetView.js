import React, { Component } from 'react';
import { View, NativeModules, requireNativeComponent } from 'react-native';

const SwiftStreetView = requireNativeComponent('SwiftStreetView', StreetView);
//const SwiftStreet = NativeModules.SwiftStreetVueManager;
console.log(SwiftStreetView);
class StreetView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 37.6506115,
        longitude: 127.0466594
      }
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('componentdidmount');
        console.log(position);
          const { coords } = position;
          const initialPosition = {
            latitude: coords.latitude,
            longitude: coords.longitude
          };
          console.log('---------------');
          console.log(initialPosition);
          this.setState({
            region: {
              latitude: initialPosition.latitude,
              longitude: initialPosition.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }
          });
          console.log(this.state.region);
      });

  }



  render() {
    console.log(this.state.region);
    return (
      <SwiftStreetView coordinate={{latitude: 37.6506115, longitude: 127.0466594}}
                       locationLabel="도봉구 창1동"/>
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
