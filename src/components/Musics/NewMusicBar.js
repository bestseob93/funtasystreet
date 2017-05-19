import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from 'native-base';
import Sound from 'react-native-sound';
import MusicControl from 'react-native-music-control';

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

let timer = null;

class NewMusicBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
      shuffle: false,
      muted: false,
      sliding: false,
      currentTime: 0,
      songDuration: 1,
      musicList: musicList,
      musicIndex: 0,
      sound: new Sound('')
    };

    this.togglePlay = this.togglePlay.bind(this);
    this.setMusic = this.setMusic.bind(this);
    this.goBackward = this.goBackward.bind(this);
    this.goForward = this.goForward.bind(this);
    this.updateMusicControl = this.updateMusicControl.bind(this);
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
      this.state.sound.pause();
      this.state.sound.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PAUSED,
          elapsedTime: seconds
        });
      });
    } else {
      this.state.sound.play();
      this.state.sound.getCurrentTime((seconds) => {
        MusicControl.updatePlayback({
          state: MusicControl.STATE_PLAYING,
          elapsedTime: seconds
        });
      });
    }

    this.setState({ playing: !this.state.playing });
  }

  setMusic() {
    console.log('setMusic');
    console.log(this.state.musicList);
    console.log(this.state.musicIndex);
    let musicUrl = this.state.musicList[this.state.musicIndex].stream_url + '?client_id=56700de568277ccc7ab1770ef756a8f8';
    Sound.setCategory('Playback');

    this.state.sound.stop().release();

    let sound = new Sound({uri: musicUrl}, (err) => {
      if(err) throw err;
      this.updateMusicControl();

      sound.play((success) => {
        if(success) {
          console.log('music playing successed');
        } else {
          console.log('playback failed due to audio decoding error');
        }
      });

      this.setState({
        sound: sound
      });
    });
  }

  goBackward() {
    console.log('goForward');
    console.log(this.state.musicIndex);
    if(this.state.musicIndex > 0) {
      this.setState({
        musicIndex: this.state.musicIndex - 1
      });
    }
    console.log(this.state.musicIndex);
  }

  goForward() {
    console.log('goBackward');
    console.log(this.state.musicIndex);
    this.setState({
      musicIndex: this.state.musicIndex + 1
    });
    console.log(this.state.musicIndex);
  }

  updateMusicControl()  {
    console.log('updatemusicControl');
    console.log(this.state.musicIndex);
    let song = {
      title: this.state.musicList[this.state.musicIndex].track,
      artwork: this.state.musicList[this.state.musicIndex].artist_url,
      artist: '',
      album: '',
      duration: this.state.sound.getDuration()
    };

    MusicControl.setNowPlaying({
      title: song.title,
      artwork: song.artwork, // URL or RN's image require()
      artist: song.artist,
      album: song.album,
      duration: song.duration, // (Seconds)
    });
  }

  render() {
    console.log('render');
    console.log(this.state.musicIndex);
    let playButton;
    if( this.state.playing ) {
      playButton = <Icon onPress={ () => this.togglePlay() } name="ios-pause" style={{padding: 30}} size={70} color="#fff" />;
    } else {
      playButton = <Icon onPress={ () => this.togglePlay() } name="ios-play" style={{padding: 30}} size={70} color="#fff" />;
    }
    return (
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Icon onPress={() => this.goBackward() } name="ios-skip-backward"/>
        {playButton}
        <Icon onPress={() => this.goForward() } name="ios-skip-forward"/>
      </View>
    );
  }
}

export default NewMusicBar;
