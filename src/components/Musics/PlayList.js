import React, { Component } from 'react';
import { View, Image, SwipeableListView, TouchableHighlight, Text, StyleSheet } from 'react-native';
import { Button, ListItem, Left, Thumbnail, Body, Icon, Right, Header } from 'native-base';
import { Actions, ActionConst } from 'react-native-router-flux';

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
    // console.log(rowData);
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
      // console.log(el);
      // console.log('---');
      // console.log(index);
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
    // console.log('ondeleterow');
    // console.log(tracks);
    // console.log(tracks[index]._id);

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
    // console.log(this.props);
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
          maxSwipeDistance={70}
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
