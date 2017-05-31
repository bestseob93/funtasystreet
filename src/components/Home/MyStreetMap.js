import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ScrollView, AppState, StyleSheet, Image, Dimensions } from 'react-native';
import { Container, Button, Content, Thumbnail, Card, CardItem, Left, Body, Right, List, ListItem } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import PushNotification from 'react-native-push-notification';

import Geofence from '../Geofence';
import CustomMarker from '../MyMusicMap/MarkerTest';
import PushController from '../common/PushController';

const { width, height } = Dimensions.get('window');

const mapHeight = height / 2.5;
const contentHeight = height - mapHeight - 100;

class MyStreetMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: props.position.lat,
        longitude: props.position.lng,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      selectedMarker: [],
      selectMode: false
    };

    this.pushAlarm = this.pushAlarm.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.renderCircles = this.renderCircles.bind(this);
    this.loadPlayList = this.loadPlayList.bind(this);
    this.renderSelectInfos = this.renderSelectInfos.bind(this);
  }

  // TODO: 이부분 더 좋은 로직으로 수정필요
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedMarker.length !== this.state.selectedMarker.length;
  }

  // componentDidMount() {
  //   const { myStreets } = this.props;
  //   AppState.addEventListener('change', this.pushAlarm);
  //   let concatedArr = [];
  //   for(let i = 0; i < myStreets.length; i++ ) {
  //     concatedArr.push(myStreets[i].circleCoords);
  //   }
  //   console.log(concatedArr);

  //   console.log(myStreets);
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       let point = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };

  //       console.log(point);
  //       for(let i = 0; i < concatedArr.length; i++) {
  //         Geofence.containsLocation(point, concatedArr[i])
  //           .then(() => console.log(i))
  //           .catch(() => console.log('no way'))
  //       }

  //     },
  //     (error) => alert(error.message),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  //   );
  // }

  componentWillUnMount() {
    AppState.removeEventListener('change', this.pushAlarm);
  }

  pushAlarm(appState) {
    console.log('pushed');
    console.log(appState);
    const { myStreets } = this.props;
     if(appState === 'background') {
    PushNotification.localNotificationSchedule({
                  message: `성북동 호랑이 주변입니다. 노래를 들어보세요`,
                  date: new Date(Date.now() + (4 * 1000)) // in 60 secs
                });
     }
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  renderMarkers(props) {
    return props.map((data, i) => {
      return (
        <MapView.Marker
          key={(data.coord.latitude + data.coord.longitude).toString()}
          coordinate={{latitude: data.coord.latitude, longitude: data.coord.longitude}}
          onSelect={(e) => console.log('onSelect', e)}
          onPress={(e) => this.setState({selectedMarker: data.music, selectedStreetName: data.street_name, selectMode: true})}
          >
          <CustomMarker key={ i } myStreetIcon={data.selectedIcon}/>
          <MapView.Callout style={styles.customView}>
              <Text>{data.street_name}</Text>
          </MapView.Callout>
        </MapView.Marker>
      );
    })
  }

  renderCircles(props) {
    console.log(props);
    return props.map((data, i) => {
      console.log(data);
      return (
        <MapView.Circle
          key={ i }
          center={{latitude: data.coord.latitude, longitude: data.coord.longitude}}
          radius={data.street_radius}
          strokeColor='transparent'
          fillColor={data.range_color}/>
      );
    });
  }

  loadPlayList() {
    let musics = this.state.selectedMarker;
    return musics.map((item, i) => {
      return (
        <ListItem thumbnail key={i}>
          <Left>
            <Thumbnail key={item.artist_url} size={20} source={{uri: `${item.artist_url}`}} />
          </Left>
            <Body><Text key={item.track}>{item.track}</Text></Body>
        </ListItem>
      );
    });
  }

  renderSelectInfos() {
    return (
          <View style={styles.scrollViewContainer}>
              <List>
                <ListItem itemDivider first>
                  <Text>거리 제목</Text>
                </ListItem>
                <ListItem style={{borderBottomWidth: 0}}>
                <Text>{this.state.selectedStreetName}</Text>
                </ListItem>
                <ListItem itemDivider>
                  <Text>최근 방문</Text>
                </ListItem>
                <ListItem style={{borderBottomWidth: 0}}>
                  <Text>2017-05-20</Text>
                </ListItem>
              { /* 최근 방문 리스트 아이템 출력 */ }
              <ListItem itemDivider>
                <Text>음악 목록</Text>
              </ListItem>
                {this.state.selectedMarker.length > 0 ? this.loadPlayList() : (<ListItem style={{borderBottomWidth: 0}}><Text>음악이 없습니다.</Text></ListItem>) }
              </List>
          </View>
    );
  }

  render() {
    const { onRegionChange, renderMarkers, renderCircles, renderSelectInfos } = this;
    const { myStreets } = this.props;
    console.log('get state console');
    console.log(this.state.region.latitude);
    return (
      <Container>
        <PushController/>
        <Content>
            <MapView provider={PROVIDER_GOOGLE}
                     style={this.state.selectMode ? styles.mapHalf : styles.map}
                     initialRegion={this.state.region}
                     region={this.state.region}
                     showsMyLocationButton={true}
                     showsUserLocation={true}
                     loadingEnabled={true}
                     onRegionChange={onRegionChange}>
                     {renderMarkers(myStreets)}
                     {renderCircles(myStreets)}
            </MapView>
            { this.state.selectMode ? renderSelectInfos() : (<Text></Text>)}
          </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height-100,
    zIndex: -1
  },
  mapHalf: {
    width: width,
    height: mapHeight,
    zIndex: -1
  },
  scrollViewContainer: {
    padding: 20
  },
  customView: {
    width: 140,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },

});

export default MyStreetMap;