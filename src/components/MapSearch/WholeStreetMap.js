import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Container, Content, Text, Thumbnail } from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

import MarkerTest from '../MyMusicMap/MarkerTest';

const { width, height } = Dimensions.get('window');

const mapHeight = height / 2.5;
const contentHeight = height - mapHeight - 100;

class WholeStreetMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 37.582176,
        longitude: 127.0095657,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      selectedMarker: []
    };

    this.onRegionChange = this.onRegionChange.bind(this);
    this.renderMarkers = this.renderMarkers.bind(this);
    this.renderCircles = this.renderCircles.bind(this);
    // this.renderMusics = this.renderMusics.bind(this);
    // this.renderMusicItems = this.renderMusicItems.bind(this);
    this.loadPlayList = this.loadPlayList.bind(this);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  renderMarkers(props) {
    return props.map((data, i) => {
      return (
        <MapView.Marker
          key={i+30}
          coordinate={{latitude: data.coord.latitude, longitude: data.coord.longitude}}
          onSelect={(e) => console.log('onSelect', e)}
          onDrag={(e) => console.log('onDrag', e)}
          onDragStart={(e) => console.log('onDragStart', e)}
          onDragEnd={(e) => console.log('onDragEnd', e)}
          onPress={(e) => this.setState({selectedMarker: data.music})}
          draggable>
          <MarkerTest key={ i } myStreetName={data.street_name}/>
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
    console.log(musics);
    return (
      <View key={musics[0].stream_url} style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',     borderWidth: 1,
          borderRadius: 2,
          borderColor: '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 1,}}>
        <Thumbnail key={musics[0].artist_url} size={200} source={{uri: `${musics[0].artist_url}`}} />
        <Text key={musics[0].track}>{musics[0].track}</Text>
      </View>
    )
  }

  render() {
    const { onRegionChange, renderMarkers, renderCircles, loadPlayList } = this;
    const { wholeStreets } = this.props;

    console.log(this.state);
    return (
      <Container>
        <Content>
            <MapView provider={PROVIDER_GOOGLE}
                     style={styles.map}
                     initialRegion={this.state.region}
                     region={this.state.region}
                     onRegionChange={onRegionChange}>
                     {renderMarkers(wholeStreets)}
                     {renderCircles(wholeStreets)}
            </MapView>
            <View style={styles.scrollViewContainer}>
              <ScrollView automaticallyAdjustContentInsets={false}
                          horizontal={true}
                          style={{
                            padding: 10, flex: 1}}>
                          {this.state.selectedMarker.length > 0 ? loadPlayList() : null}
              </ScrollView>
          </View>
          </Content>
      </Container>
    );
  }
  }

  const styles = StyleSheet.create({
  map: {
    width: width,
    height: mapHeight,
    zIndex: -1
  },
  scrollViewContainer: {
    height: 200,
    padding: 20
  }
  });

export default WholeStreetMap;
