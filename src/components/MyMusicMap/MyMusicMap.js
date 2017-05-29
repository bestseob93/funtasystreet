import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { View, Slider, Modal, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Text, Item, Header, Form, Input, Card, CardItem, Left, Right, Body, Button, Title, Icon, Container, Content, Picker } from 'native-base';
import { Actions } from 'react-native-router-flux';
import CustomMarker from './MarkerTest';
import axios from 'axios';
// import RequiredLogin from '../Auth/RequiredLogin';

import * as music from '../../ducks/music.duck';

const { width, height } = Dimensions.get('window');

const propTypes = {
  isLogged: PropTypes.bool,
  MapsActions: PropTypes.object,
  address: PropTypes.string,
  MusicActions: PropTypes.object
};

class MyMusicMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      position: null,
      region: {
        latitude: 37.582176,
        longitude: 127.0095657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      initialRegion: {
        latitude: 37.582176,
        longitude: 127.0095657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      fillInfoMode: false,
      street_radius: 1000,
      street_name: '',
      range_color: 'rgba(244, 93, 93, 0.5)',
      selectedItem: undefined,
      selectedIcon: 'ios-heart'
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onNextButtonPress = this.onNextButtonPress.bind(this);
    this._findMe = this._findMe.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._clearState = this._clearState.bind(this);
  }

  componentWillReceiveProps() {
    this.setState({
      modalVisible: true,
      fillInfoMode: false
    });
  }

  componentWillUnMount() {
    this.setState({
      modalVisible: false
    });
  }

  onValueChange (value) {
      this.setState({
        selectedIcon : value
      });
    }

  toggleModal(visible) {
    this.setState({
      modalVisible: visible
    });
    Actions.home();
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  onNextButtonPress() {
    this.setState({
      fillInfoMode: true
    });
  }

  _findMe() {
    navigator.geolocation.getCurrentPosition(
      ({coords}) => {
        const {latitude, longitude} = coords
        this.setState({
          position: {
            latitude,
            longitude
          },
          region: {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }
        });
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }

  handleSubmit() {
    const { MapsActions, MusicActions } = this.props;
    console.log(this.props);

    let music;

    if(this.props.isFromSearch) {
      music = {
        track: this.props.track,
        likes: this.props.likes,
        plays_back: this.props.plays_back,
        artist_url: this.props.artist_url,
        stream_url: this.props.stream_url,
        duration: this.props.duration
      };
    }

    let coordinate = {
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude
    };

    axios({
      method: 'GET',
      url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&language=ko&key=AIzaSyAZ4wxXzeheT3jy1dRY-8kyTLdO4Vl0AJI`
    }).then( res => {
        console.log(res);
        let address = res.data.results[3].formatted_address;
        console.log(address);
        MusicActions.requestRegisterStreet(this.state.selectedIcon, this.state.street_name, this.state.street_radius, this.state.range_color, coordinate, address, music).then(() => {
          this._clearState();
        });
    }).catch( err => {
        throw err;
    });
  }

  _clearState() {
    this.setState({
      modalVisible: false,
      fillInfoMode: false,
      street_name: '',
      street_radius: 1000,
      range_color: 'rgba(244, 93, 93, 0.5)'
    });
  }

  render() {
    const { toggleModal, onRegionChange, onNextButtonPress, _findMe, handleSubmit } = this;
    const colorArr = ['rgba(244, 93, 93, 0.5)', 'rgba(235, 184, 97, 0.5)', 'rgba(39, 51, 236, 0.5)', 'rgba(226, 245, 15, 0.5)', 'rgba(28, 135, 83, 0.5)', 'rgba(51, 12, 122, 0.5)', 'rgba(0, 0, 0, 0.5)', 'rgba(208, 0, 12, 0.5)', 'rgba(254, 0, 175, 0.5)', 'rgba(52, 83, 244, 0.5)'];
    const renderFillInfoView = () => {
      return (
        <View style={{flex: 1}}>
          <View style={styles.fillContainer}>
            <View>
              <Text style={{padding: 10}}>거리 아이콘</Text>
              <View style={styles.pickerContainer}>
                <Icon name={this.state.selectedIcon} style={{color: "#66a0ff", fontSize: 15}}/>
                     <Picker
                        supportedOrientations={['portrait','landscape']}
                        headerComponent={
                            <Header>
                              <Left>
                                <Button transparent>
                                </Button>
                              </Left>
                              <Body>
                                <Title>아이콘 선택</Title>
                              </Body>
                              <Right>
                                <Button transparent>
                                </Button>
                              </Right>
                            </Header>
                        }
                        mode="dropdown"
                        selectedValue={this.state.selectedIcon}
                        onValueChange={(value) => this.onValueChange(value)}>
                        <Picker.Item label="데이트 중에서" value="ios-heart"/>
                        <Picker.Item label="여행 중에서" value="ios-walk"/>
                        <Picker.Item label="버스 안에서" value="ios-bus"/>
                        <Picker.Item label="우울한 기분에서" value="ios-rainy"/>
                        <Picker.Item label="카페 안에서" value="ios-cafe"/>
                   </Picker>
                   <Icon style={{fontSize: 13, color: '#c1c1c1'}} name="ios-arrow-forward"/>
              </View>
              <Text style={{padding: 10}}>거리 제목</Text>
              <Form>
                <View style={styles.inputContainer}>
                  <Item>
                    <Input
                      placeholder="성북동 호랑이 거리"
                      onChangeText={(text) => {this.setState({street_name: text})}}
                      value={this.state.street_name}/>
                  </Item>
                </View>
              </Form>
            </View>

            <View>
              <Text style={{padding: 10}}>음악 거리 반경</Text>
                <Text style={{textAlign: 'center'}}>
                  반경 {this.state.street_radius}m
                </Text>
                <Slider
                  value={this.state.street_radius}
                  minimumValue={250}
                  maximumValue={2000}
                  step={25}
                  style={styles.slider}
                  onValueChange={(value) => this.setState({street_radius: value})} />
            </View>

          </View>
          <View style={{flex: 7, marginTop: 30}}>
            <Text style={{padding: 10}}>범위 색깔</Text>
            <ScrollView
              ref={(scrollView) => { _scrollView = scrollView; }}
              automaticallyAdjustContentInsets={false}
              horizontal={true}
              style={{padding: 10}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                {colorArr.map((boxColor) => (
                  <Button key={boxColor}
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 10,
                          backgroundColor: `${boxColor}`}}
                        onPress={() => this.setState({range_color: boxColor})}>
                  </Button>))}
                </View>
            </ScrollView>
          </View>
        </View>
      );
    };

    const varTop = height - 150;
     const hitSlop = {
       top: 15,
       bottom: 15,
       left: 15,
       right: 15,
     }
     bbStyle = function(vheight) {
       return {
         position: 'absolute',
         top: vheight,
         left: 10,
         right: 10,
         backgroundColor: 'transparent',
         alignItems: 'center',
       }
     }

    return (
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={this.state.modalVisible}>
          <Container>
            <Header>
              <Left>
                <Button transparent onPress={()=> (
                  toggleModal(false)
                  )}>
                  <Icon style={{color: '#787878'}} name='close'/>
                </Button>
              </Left>
              <Body>
                <Title>음악 거리 만들기</Title>
              </Body>
              <Right>
                {this.state.fillInfoMode ? (
                  <Button transparent onPress={() => handleSubmit()}>
                    {this.props.isFetching ? (<Text>올리는중..</Text>) : (<Text>완료</Text>)}
                </Button>) : (<Button transparent onPress={onNextButtonPress}><Text>다음</Text></Button>)}
              </Right>
            </Header>
            <Content>
              <View style={this.state.fillInfoMode ? null : bbStyle(varTop)}>
                <TouchableOpacity
                  hitSlop = {hitSlop}
                  activeOpacity={0.7}
                  style={ this.state.fillInfoMode ? null : styles.mapButton}
                  onPress={ () => _findMe() }
                >
                    {this.state.fillInfoMode ? (<Text></Text>) : (
                      <Text style={{fontWeight: 'bold', color: 'black',}}>
                        Find Me
                      </Text>
                    )}
                </TouchableOpacity>
              </View>
              <MapView provider={PROVIDER_GOOGLE}
                       style={this.state.fillInfoMode ? styles.maphalf : styles.map}
                       initialRegion={this.state.initialRegion}
                       region={this.state.region}
                       showsMyLocationButton={true}
                       onRegionChange={onRegionChange}>
                       <MapView.Marker
                         coordinate={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                         onSelect={(e) => console.log('onSelect', e)}
                         onDrag={(e) => console.log('onDrag', e)}
                         onDragStart={(e) => console.log('onDragStart', e)}
                         onDragEnd={(e) => console.log('onDragEnd', e)}
                         onPress={(e) => console.log('onPress', e)}
                         draggable>
                         <CustomMarker myStreetIcon={this.state.selectedIcon}/>
                       </MapView.Marker>
                       <MapView.Circle
                         key={(this.state.region.longitude + this.state.region.latitude).toString()}
                         center={{latitude: this.state.region.latitude, longitude: this.state.region.longitude}}
                         radius={this.state.street_radius}
                         strokeColor='transparent'
                         fillColor={this.state.range_color}/>
              </MapView>
              { this.state.fillInfoMode ? renderFillInfoView() : (<Text></Text>) }
            </Content>
          </Container>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: height,
    zIndex: -1
  },
  maphalf: {
    width: width,
    height: height / 2.5,
    zIndex: -1
  },
  slider: {
    height: 30,
    margin: 10
  },
  fillContainer: {
    marginTop: 30,
    backgroundColor: '#fff'
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 13
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#dc98f7',
    borderRadius: 5
  },
  mapButton: {
   width: 75,
   height: 75,
   borderRadius: 85/2,
   backgroundColor: 'rgba(252, 253, 253, 0.9)',
   justifyContent: 'center',
   alignItems: 'center',
   shadowColor: 'black',
   shadowRadius: 8,
   shadowOpacity: 0.12,
   opacity: .6,
   zIndex: 10,
  }
});

MyMusicMap.propTypes = propTypes;

export default connect(
  state => {
    return {
      isLogged: state.auth.authStatus.isLogged,
      isFetching: state.music.registerRequest.fetching
    };
  },
  dispatch => {
    return {
      MusicActions: bindActionCreators({
        requestRegisterStreet: music.requestRegisterStreet
      }, dispatch)
    }
  }
)(MyMusicMap);
