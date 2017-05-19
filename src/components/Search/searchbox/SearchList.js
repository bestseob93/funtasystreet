import React, { Component, PropTypes } from 'react';
import { TouchableHighlight, Dimensions, View, Modal, ListView, RefreshControl } from 'react-native';
import { Left, Icon, Body, Right, Thumbnail, ListItem, Text, Button, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { CommonSpinner } from '../../common';

const propTypes = {
  data: PropTypes.array,
  nextHref: PropTypes.string,
  onScrollUp: PropTypes.func,
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
  refresh: PropTypes.func,
  nowPage: PropTypes.number,
  musicSel: PropTypes.func
};

const LoadingIndicator = ({ loading }) => (
  loading ? (
    <CommonSpinner/>
  ) : null
);


class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingStatus: {},
      isOpen: false,
      datas: [],
      selectMusic: {},
      ds: new ListView.DataSource({ rowHasChanged: this._rowHasChanged})
    }

    this._update = this._update.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.onEndReached = this.onEndReached.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.onScrollUpRequest = this.onScrollUpRequest.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.playSelectedMusic = this.playSelectedMusic.bind(this);
    this.newStreetButtonPress = this.newStreetButtonPress.bind(this);
    this.existStreetButtonPress = this.existStreetButtonPress.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  componentWillMount() {
    console.log('componentWillMount');
    const { data } = this.props;
    this.setState({
      datas: data,
      ds: this.state.ds.cloneWithRows([ ...data ])
    });
  }

  onScrollUpRequest() {
    const loadingStatus = { loading: true };
    this._update(loadingStatus, this.state.datas);
  }

  onScrollUpSuccess() {
    const loadingStatus = { loading: false };
    const datas = this.props.nowPage <= 2 ? this.state.datas : [ ...this.state.datas, ...this.props.data ];
    this._update(loadingStatus, datas);
  }

  onScrollUpFailure() {
    const loadingStatus = { loading: false };
    this._update(loadingStatus, this.state.datas);
  }

  getNextDatas() {
    const { nextAction, nextHref, nowPage } = this.props;
    this.onScrollUpRequest();

    nextAction.requestNext(nextHref, nowPage)
              .then(() => this.onScrollUpSuccess())
              .catch(err => this.onScrollUpFailure());
  }

  _update(loadingStatus, datas) {
    const loading = {
      type: 'Loading',
      loading: loadingStatus.loading
    }
    this.setState({
      loadingStatus: loadingStatus,
      datas: datas,
      ds: this.state.ds.cloneWithRows([ ...datas ])
    });
  }

  onRefresh() {
    const { refresh } = this.props;
    refresh();
  }

  onEndReached() {
    const { loadingStatus } = this.state;
    const { nextHref, nowPage, isFetching, isFetched, data } = this.props;
    if(!loadingStatus.loading && nextHref !== '') {
        this.getNextDatas()
    }
  }

  _rowHasChanged(r1, r2) {
    return r1 !== r2;
  }


  renderRow(item) {
    const { isFetching } = this.props;
    console.log(item);
    let artwork_url;
    if(item.artwork_url === null) {
      artwork_url = "https://c1.staticflickr.com/5/4194/33900642883_e12fce7386_b.jpg"
    } else {
      artwork_url = item.artwork_url
    }

    if(isFetching) {
      return <LoadingIndicator loading={isFetching} />
    } else {
      return (
        <ListItem thumbnail onPress={() => this.playSelectedMusic(item)}>
          <Left>
          <Thumbnail source={{uri: `${artwork_url}`}} />
          </Left>
          <Body>
            <Text style={{fontSize: 16}}>{item.title}</Text>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <Icon style={{fontSize: 13}} name="ios-heart"/>
                <Text style={{fontSize: 13}}>{item.likes_count}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Icon style={{fontSize: 15}} name="ios-play"/>
                <Text style={{fontSize: 13}}>{item.playback_count}</Text>
              </View>
            </View>
          </Body>
          <Right>
            <Button onPress={() => {this.toggleModal(true, item);}} transparent>
              <Text><Icon name={'ios-more'}/></Text>
            </Button>
          </Right>
        </ListItem>
      );
    }
  }

  toggleModal(visible, item) {
    this.setState({
      isOpen: visible,
      selectMusic: item
    });
    console.log(item);
  }

  async playSelectedMusic(selectedMusic) {
    const { musicSel } = this.props;

    try {
      await musicSel(selectedMusic);
    } catch(e) {
      console.error(e);
    }
  }

  async newStreetButtonPress() {
    const { clearState } = this;

    await Actions.mymusicmap({
      track: this.state.selectMusic.title,
      likes: this.state.selectMusic.likes_count,
      plays_back: this.state.selectMusic.playback_count,
      artist_url: this.state.selectMusic.artwork_url,
      stream_url: this.state.selectMusic.stream_url,
      duration: this.state.selectMusic.duration,
      isFromSearch: true
    }); // mymusicmap으로 선택한 음악 정보 전달

    clearState();
  }

  async existStreetButtonPress() {
    const { clearState } = this;

    await Actions.mymusicstreet({
      track: this.state.selectMusic.title,
      likes: this.state.selectMusic.likes_count,
      plays_back: this.state.selectMusic.playback_count,
      artist_url: this.state.selectMusic.artwork_url,
      stream_url: this.state.selectMusic.stream_url,
      duration: this.state.selectMusic.duration,
      isFromSearch: true
    });

    clearState();
  }

  clearState() {
    this.setState({
      isOpen: false,
      selectMusic: {}
    });
  }

  render() {
    const { onRefresh,
            onEndReached,
            renderRow,
            toggleModal,
            newStreetButtonPress,
            existStreetButtonPress,
            clearState } = this;

    return (
      <View>
        <ListView
          enableEmptySections={true}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.ds}
          renderRow={row => renderRow(row)}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => onRefresh()}
            />
          }
          onEndReached={() => onEndReached()}
          onEndReachedThreshold={30}
        />
        <Modal animationType={"slide"}
               style={styles.modal}
               transparent={true}
               visible={this.state.isOpen}>
               <View style={styles.modal}>
                 <TouchableHighlight activeOpacity={0.3} style={styles.transparentView} onPress={()=> toggleModal(false, {})}>
                   <View>
                     <View style={styles.transparent}></View>
                   </View>
                 </TouchableHighlight>

                 <View style={styles.modalContentView}>
                   <View style={styles.modalContent}>
                     <Thumbnail style={styles.modalThumbnail} size={60} source={{uri: `${this.state.selectMusic.artwork_url}`}} />
                     <Text style={styles.selectMusicMargin}>{this.state.selectMusic.title}</Text>
                     <Button onPress={() => newStreetButtonPress()} style={styles.selectMusicButton} full><Text>음악 거리 새로 만들기</Text></Button>
                     <Button onPress={() => existStreetButtonPress()} style={styles.selectMusicButton} full><Text>기존 거리에 음악 추가하기</Text></Button>
                     <Button style={styles.selectMusicButton} full><Text>공유하기</Text></Button>
                     <Button onPress={clearState} style={styles.selectMusicButton} full><Text>취소</Text></Button>
                   </View>
                 </View>
               </View>
        </Modal>
      </View>
    );
  }
}

const styles = {
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentView: {
    flex: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  transparent: {
    width: Dimensions.get('window').width
  },
  modalContentView: {
    flex: 5,
    backgroundColor: '#ffffff'
  },
  modalContent: {
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },
  modalThumbnail: {
    marginTop: 10,
    marginBottom: 10
  },
  selectMusicMargin: {
    marginBottom: 25
  },
  selectMusicButton: {
    backgroundColor: '#000',
    marginBottom: 5
  }
}

SearchList.propTypes = propTypes;

export default SearchList;
