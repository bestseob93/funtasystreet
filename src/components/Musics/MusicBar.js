import React, { Component, PropTypes } from 'react';
import { Dimensions, Modal, View, Slider } from 'react-native';
import { H3, Button, Thumbnail, Text, Footer, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Sound from 'react-native-sound';
import MusicControl from 'react-native-music-control';
import { Col, Row, Grid } from 'react-native-easy-grid';

const musicList = [
  {
    track: "ZionT - Complex",
    artist_url: "https://i1.sndcdn.com/artworks-000205587916-9j5h9c-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/305424047/stream"
  },
  {
    track: "EPIK HIGH - 420 (feat. Double K, Yankie, Dok2, Sean2Slow, Dumbfoundead, TopBob, MYK)",
    artist_url: "https://i1.sndcdn.com/artworks-000126503507-uc09pu-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/116682619/stream"
  },
  {
    track: "ZionT - 노래 ( The Song )",
    artist_url: "https://i1.sndcdn.com/artworks-000205587881-hmktcx-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/305424187/stream"
  },
  {
    track: "Cheeze (치즈) - 망고 (Mango)",
    artist_url: "https://i1.sndcdn.com/artworks-000055556482-arxysx-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/105858827/stream"
  },
  {
    track: "Cheeze(치즈) - 피노키오",
    artist_url: "https://i1.sndcdn.com/artworks-000202594241-kak4rc-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/268401598/stream"
  },
  {
    track: "10cm - 내 눈에만 보여",
    artist_url: "https://i1.sndcdn.com/artworks-000197608831-nbu95y-large.jpg",
    stream_url: "https://api.soundcloud.com/tracks/297042589/stream"
  }
];

class MusicBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
      playing: true,
      shuffle: false,
      muted: false,
      sliding: false,
      currentTime: 0,
      songDuration: 1,
      musicList: musicList,
      musicIndex: 0,
    };

    this.sound = new Sound('');

    this.togglePlay = this.togglePlay.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.randomMusicIndex = this.randomMusicIndex.bind(this);
    this.setMusic = this.setMusic.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.goForward = this.goForward.bind(this);
    this.updateMusicControl = this.updateMusicControl.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', true);
    MusicControl.enableBackgroundMode(true);
    MusicControl.on('play', ()=> {
      this.togglePlay();
    });

    MusicControl.on('pause', ()=> {
      this.togglePlay();
    });

    MusicControl.on('nextTrack', this.goForward.bind(this));
    MusicControl.on('previousTrack', this.goBackward.bind(this));

    console.log('componentDidMount');
    console.log(this.state.musicIndex);

    setTimeout(() => {
          this.setMusic();
    }, 3000); // setTimeout이 최선인지?

  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props.nowPlayList);
    if(this.state.musicList === nextProps.nowPlayList) return;
    this.setState({
      musicList: nextProps.nowPlayList
    });
    this.setMusic();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate');
    console.log(this.state.musicIndex);
    if(prevState.musicIndex === this.state.musicIndex) return;
    this.setMusic();
  }

  togglePlay() {
    if(this.state.playing) {
      this.sound.pause();
      this.sound.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
          elapsedTime: seconds
        });
      });
    } else {
      this.sound.play();
      this.sound.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
          elapsedTime: seconds
        });
      });
    }

    this.setState({ playing: !this.state.playing });
  }

  toggleShuffle() {
    this.setState({ shuffle: !this.state.shuffle });
  }

  toggleVolume(){
    this.setState({ muted: !this.state.muted });
    if (this.state.muted) {
      this.sound.setVolume(0);
    }
    else {
      this.sound.setVolume(1);
    }
  }

  randomMusicIndex() {
    let maxIndex = this.state.musicList.length - 1;
    return Math.floor(Math.random() * (maxIndex - 0 + 1)) + 0;
  }

  setMusic() {
    console.log('setMusic');
    console.log(this.state.musicList);
    console.log(this.state.musicIndex);
    let musicUrl = this.state.musicList[this.state.musicIndex].stream_url + '?client_id=56700de568277ccc7ab1770ef756a8f8';
    Sound.setCategory('Playback');

    this.sound.stop().release();

    this.sound = new Sound({uri: musicUrl}, (err) => {
      if(err) throw err;
      this.updateMusicControl();

      this.sound.play((success) => {
        if(success) {
          console.log('music playing successed');
          this.goForward();
        } else {
          console.log('playback failed due to audio decoding error');
        }
      });
    });
  }

  goBackward() {
    if(this.state.currentTime < 3 && this.state.musicIndex !== 0) {
      this.setState({
        musicIndex: this.state.musicIndex - 1,
        currentTime: 0,
        playing: true
      });
    } else {
      this.sound.setCurrentTime(0);
      this.setState({
        currentTime: 0
      });
    }
  }

  goForward() {
    this.setState({
      musicIndex: this.state.shuffle ? this.randomMusicIndex : this.state.musicIndex + 1,
      currentTime: 0,
      playing: true
    });
  }

  updateMusicControl()  {
    console.log('updatemusicControl');
    console.log(this.state.musicIndex);
    let song = {
      title: this.state.musicList[this.state.musicIndex].track,
      artwork: this.state.musicList[this.state.musicIndex].artist_url,
      artist: '',
      album: '',
      duration: this.sound.getDuration()
    };

    MusicControl.setNowPlaying({
      title: song.title,
      artwork: song.artwork, // URL or RN's image require()
      artist: song.artist,
      album: song.album,
      duration: song.duration, // (Seconds)
    });
  }

  toggleModal(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    const { toggleModal,
            togglePlay,
            toggleShuffle,
            toggleVolume,
            goBackward,
            goForward } = this;

    const { musicBarStyle, thumbnailSize, buttonStyle } = style;

    let tSizeArtworkUrl = '';

    if(this.state.musicList[this.state.musicIndex].artist_url !== null) {
      tSizeArtworkUrl = this.state.musicList[this.state.musicIndex].artist_url.replace("large.jpg", "t500x500.jpg");
    } else {
      // TODO : insert default image
      tSizeArtworkUrl = '';
    }

    let songPercentage = this.state.currentTime / this.state.songDuration;

    console.log(songPercentage);

    let iconMuted = this.state.muted ? {color: '#f62976'} : {color: '#000'};
    let iconShuffled = this.state.shuffled ? {color: '#f62976'} : {color: '#000'};

    return (
      <View style={ musicBarStyle } >
        <Button style={ buttonStyle }
                onPress={() => toggleModal(true)}>
            {/* TODO:비어있을 경우 버튼 막기 추가하기 */}
            {/* Thumbnail */}
            <View style={{flex:0.2}}>
              <Thumbnail style={ thumbnailSize }
                         source={{uri: this.state.musicList[this.state.musicIndex].artist_url === '' ? 'https://i1.sndcdn.com/avatars-000230469080-ka0bxj-t500x500.jpg' : `${this.state.musicList[this.state.musicIndex].artist_url}`}}/>
            </View>

            {/* Artists & Title */}
            <View style={{flex: 0.5}}>
              <Text numberOfLines={1} style={{fontSize: 13}}>{this.state.musicList[this.state.musicIndex].track === '' ? '음악 거리가 비어있습니다.' : this.state.musicList[this.state.musicIndex].track}</Text>
            </View>

            {/* Control Buttons */}
            <View style={{flex:0.3, flexDirection: 'row', justifyContent: 'flex-end'}}>
              { this.state.playing ? <Icon style={{color: '#ffffff'}} name="ios-pause" onPress={() => togglePlay()}/> :
                               <Icon style={{color: '#ffffff'}} name="ios-play" onPress={() => togglePlay()}/>}
                <Icon style={{color: '#ffffff'}} name="ios-skip-forward" onPress={() => goForward()}/>
                <Icon name="list" style={{color: '#ffffff'}} onPress={Actions.playlistindepend}/>
            </View>
        </Button>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}>
          <Grid>
            <Row size={10} style={{ backgroundColor: '#ffffff' }}>
              <View style={style.headerContainer}>
                <Button transparent onPress={() => toggleModal(false)}>
                  <Icon name="ios-arrow-down" style={{color: 'blue', fontSize: 27}}/>
                </Button>
                <Button transparent onPress={() => toggleModal(false)}>
                  <Icon name="list" style={{color: 'blue', fontSize: 30}}/>
                </Button>
              </View>
            </Row>
            <Row size={50} style={{ backgroundColor: '#ffffff' }}>
              <View style={style.commonContainer}>
                <Thumbnail style={{width: 300, height: 300, borderRadius: 150}} source={{uri: this.state.musicList[this.state.musicIndex].artist_url === '' ? 'https://i1.sndcdn.com/avatars-000230469080-ka0bxj-t500x500.jpg' : `${tSizeArtworkUrl}`}}/>
              </View>
            </Row>
            <Row size={20} style={{ backgroundColor: '#ffffff' }}>
              <View style={style.titleContainer}>
                <H3 style={{textAlign: 'center', width: 250}}>{this.state.musicList[this.state.musicIndex].track}</H3>
              </View>
            </Row>
            <Row size={20} style={{ backgroundColor: '#ffffff' }}>
            <View style={style.footerContainer}>
              <View style={style.spaceView}></View>
              <View style={style.iconContainer}>
                { this.state.muted ? <Icon style={style.iconNotMuted} name="ios-volume-mute" onPress={() => toggleVolume()}/> :
                                       <Icon style={style.iconMuted} name="ios-volume-mute" onPress={() => toggleVolume()}/>}
                <Icon style={style.iconStyle} name="ios-skip-backward" onPress={() => goBackward()}/>
                { this.state.playing ? <Icon style={style.iconPlayPause} name="ios-pause" onPress={() => togglePlay()}/> :
                                       <Icon style={style.iconPlayPause} name="ios-play" onPress={() => togglePlay()}/>  }
                <Icon style={style.iconStyle} name="ios-skip-forward" onPress={() => goForward()}/>
                { this.state.shuffle ? <Icon style={{color: '#e79a41', paddingLeft: 50, fontSize: 23}} name="ios-shuffle" onPress={() => toggleShuffle()}/> :
                                       <Icon style={{color: '#000', paddingLeft: 50, fontSize: 23}} name="ios-shuffle" onPress={() => toggleShuffle()}/>}
              </View>
              <View style={style.spaceView}></View>
            </View>
            </Row>
          </Grid>
        </Modal>
      </View>
    );
  }
}

const style = {
  musicBarStyle: {
    position: 'absolute',
    left: 0,
    bottom: 46,
    right: 0,
    backgroundColor: 'white',
    borderTopColor: 'transparent'
  },
  buttonStyle: {
    width: Dimensions.get('window').width,
    borderRadius: 0,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black'
  },
  thumbnailSize: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  commonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  spaceView: {
    flex: 0.1
  },
  iconContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconMuted: {
    paddingRight: 50,
    fontSize: 36
  },
  iconNotMuted: {
    paddingRight: 50,
    fontSize: 36,
    color: '#ff5858'
  },
  iconStyle: {
    color: '#000000',
    justifyContent: 'flex-end'
  },
  iconPlayPause: {
    color: '#000000',
    paddingLeft: 50,
    paddingRight: 50,
    fontSize: 50
  }
};

export default MusicBar;
