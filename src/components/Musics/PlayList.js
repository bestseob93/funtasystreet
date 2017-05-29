import React, { Component } from 'react';
import { View, Image, SwipeableListView, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Button, ListItem, Left, Thumbnail, Body, Icon, Right, Header } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

let tracks = [
  {
    artist: 'ZAYN(제인)',
    title: 'Still Got Time (feat. PARTYNEXTDOOR)',
    image_url: 'https://unsplash.it/300/300?image=0',
  },
  {
    artist: 'Set The Tone',
    title: 'The Boulevards',
    image_url: 'https://unsplash.it/300/300?image=1',
  },
  {
    artist: 'Light My Body Up (feat. Nicki Minaj & Lil Wayne)',
    title: 'David Guetta(데이빗)',
    image_url: 'https://unsplash.it/300/300?image=2',
  },
  {
    artist: 'The Way I Feel (Original Mix)',
    title: 'The Node',
    image_url: 'https://unsplash.it/300/300?image=3',
  },
  {
    artist: "I'll Catch You (Original Mix)",
    title: 'Angemi',
    image_url: 'https://unsplash.it/300/300?image=4',
  },
  {
    artist: 'Connected',
    title: 'ATB & Andrew Rayel',
    image_url: 'https://unsplash.it/300/300?image=5',
  },
  {
    artist: 'Gang Up',
    title: 'Young Thug',
    image_url: 'https://unsplash.it/300/300?image=6',
  },
  {
    artist: 'Some Kinda Wonderful',
    title: 'Betty Who(베티 후)',
    image_url: 'https://unsplash.it/300/300?image=7',
  },
  {
    artist: 'Light My Body Up (feat. Nicki Minaj & Lil Wayne)',
    title: 'David Guetta(데이빗)',
    image_url: 'https://unsplash.it/300/300?image=8',
  },
  {
    artist: 'The Way I Feel (Original Mix)',
    title: 'The Node',
    image_url: 'https://unsplash.it/300/300?image=9',
  },
  {
    artist: "I'll Catch You (Original Mix)",
    title: 'Angemi',
    image_url: 'https://unsplash.it/300/300?image=100',
  },
  {
    artist: 'ZAYN(제인)',
    title: 'Still Got Time (feat. PARTYNEXTDOOR)',
    image_url: 'https://unsplash.it/300/300?image=101',
  },
  {
    artist: 'Set The Tone',
    title: 'The Boulevards',
    image_url: 'https://unsplash.it/300/300?image=102',
  },
  {
    artist: 'Light My Body Up (feat. Nicki Minaj & Lil Wayne)',
    title: 'David Guetta(데이빗)',
    image_url: 'https://unsplash.it/300/300?image=103',
  },
  {
    artist: 'The Way I Feel (Original Mix)',
    title: 'The Node',
    image_url: 'https://unsplash.it/300/300?image=104',
  },
  {
    artist: "I'll Catch You (Original Mix)",
    title: 'Angemi',
    image_url: 'https://unsplash.it/300/300?image=110',
  },
  {
    artist: 'Connected',
    title: 'ATB & Andrew Rayel',
    image_url: 'https://unsplash.it/300/300?image=106',
  },
  {
    artist: 'Gang Up',
    title: 'Young Thug',
    image_url: 'https://unsplash.it/300/300?image=107',
  },
  {
    artist: 'Some Kinda Wonderful',
    title: 'Betty Who(베티 후)',
    image_url: 'https://unsplash.it/300/300?image=108',
  },
  {
    artist: 'Light My Body Up (feat. Nicki Minaj & Lil Wayne)',
    title: 'David Guetta(데이빗)',
    image_url: 'https://unsplash.it/300/300?image=109',
  },
];

class PlayList extends Component {
  constructor(props) {
    super(props);

    const ds = SwipeableListView.getNewDataSource();
    console.log(props);
    this.state = {
      dataSource: ds.cloneWithRowsAndSections(...this.genDataSource(this.props.music)),
      tracks: this.props.music,
      isDeleted: false
    };

    this.renderCustomQuickActions = this.renderCustomQuickActions.bind(this);
    this.renderSeparator = this.renderSeparator.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.backTo = this.backTo.bind(this);
  }

  genDataSource(rowData) {
    console.log(rowData);
    const dataBlob = {};
    const sectionIDs = ['Section 0'];
    const rowIDs = [[]];

    /**
     * dataBlob example below:
      {
        'Section 0': {
          'Row 0': {
            id: '0',
            text: 'row 0 text'
          },
          'Row 1': {
            id: '1',
            text: 'row 1 text'
          }
        }
      }
    */

    dataBlob['Section 0'] = {};
    rowData.forEach((el, index) => {
      console.log(el);
      console.log('---');
      console.log(index);
      const rowName = `${index}`;
      dataBlob[sectionIDs[0]][rowName] = {
        id: rowName,
        ...el,
      };
      rowIDs[0].push(rowName);
    });

    return [dataBlob, sectionIDs, rowIDs];
  }
  

  renderSeparator(sectionID, rowID) {
    return <View key={`${sectionID}-${rowID}`} style={styles.separator} />;
  }

  renderCustomQuickActions(rowData, sectionID, rowID) {
    return (
      <View style={styles.actionsContainer}>
        <TouchableHighlight
          style={[styles.actionButton, { backgroundColor: 'gold' }]}
          underlayColor="transparent"
          onPress={() => console.log(rowID)}>
          <Icon name="arrow-up"/>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.actionButton, { backgroundColor: 'gold' }]}
          underlayColor="transparent"
          onPress={() => console.log(rowID)}>
          <Icon name="arrow-down"/>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.actionButton, { backgroundColor: '#bb2626' }]}
          underlayColor="transparent"
          onPress={() => this.onDeleteRow(parseInt(rowID))}>
          <Text style={{color: 'white'}}>삭제</Text>
        </TouchableHighlight>
      </View>
    );
  }

  onDeleteRow(index) {
    const { streetId, streetIndex, onDelete } = this.props;
    let tracks = this.state.tracks;
    console.log('ondeleterow');
    console.log(tracks);
    console.log(tracks[index]._id);

    onDelete(streetId, tracks[index]._id, streetIndex);
    tracks = [...tracks.slice(0, index), ...tracks.slice(index + 1)];

    const ds = SwipeableListView.getNewDataSource();
    this.setState({
      dataSource: ds.cloneWithRowsAndSections(...this.genDataSource(tracks)),
      tracks: tracks,
      isDeleted: true
    });
  }

  componentWillUnmount() {
    this.setState({
      isDeleted: false
    });
  }

  onSelectRow(rowID) {
    const openID = this.state.dataSource.getOpenRowID();
    if (openID && openID === rowID) {
      this.setState({
        dataSource: this.state.dataSource.setOpenRowID(null),
      });
    }

    // Add your codes
  }

  renderRow(rowData, sectionID, rowID) {
    const { track, likes, duration, plays_back, stream_url, artist_url } = rowData;

    return (
      <TouchableHighlight
        style={{ flex: 1 }}
        underlayColor="gray"
        onPress={() => this.onSelectRow(rowID)}>
        <View style={styles.rowContainer}>
          <Image style={styles.thumbnail} source={{ uri: artist_url }} />
          <View style={styles.textContainer}>
            <Text numberOfLines={1} style={styles.trackTitle}>{track}</Text>
            <View style={{flexDirection: 'row'}}>
             <Icon style={{marginRight: 5, fontSize: 12}} name="ios-heart"/><Text style={styles.artistName}>{likes}</Text>
              <Icon style={{marginLeft: 20, marginRight: 5, fontSize: 12}} name="ios-play"/><Text style={styles.artistName}>{plays_back}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  backTo() {
    Actions.pop({refresh: {isDeleted: true} });
  }

  render() {
    console.log(this.props);
    return (
      <View style={{ flex: 1 }}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.backTo()}>
              <Icon name="arrow-back"/>
            </Button>
          </Left>
          <Body>
            <Text style={{fontSize: 16, fontWeight: '500'}}>내 재생 목록</Text>
          </Body>
          <Right>
            <Button transparent></Button>
          </Right>
        </Header>
        <SwipeableListView
          style={styles.list}
          contentContainerStyle={styles.contentContainer}
          dataSource={this.state.dataSource}
          maxSwipeDistance={210}
          renderQuickActions={this.renderCustomQuickActions}
          renderRow={this.renderRow}
          renderSeparator={this.renderSeparator}
          enableEmptySections={true}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: 'white'
  },
  contentContainer: {
    paddingTop: 20,
    paddingBottom: 80
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 5,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    height: 70
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: 'lightgray',
    marginRight: 5
  },
  textContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    paddingHorizontal: 12
  },
  trackTitle: {
    fontSize: 13,
    color: 'black'
  },
  artistName: {
    fontSize: 12,
    color: '#a5a5a5'
  },
  separator: {
    height: 0.5,
    alignSelf: 'stretch',
    backgroundColor: 'lightgray'
  },
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  actionButton: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default PlayList;
