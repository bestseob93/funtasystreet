import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { checkStatus } from './checkStatus';
import { Actions } from 'react-native-router-flux';

const ROOT_URL = 'http://kkoong-feed.xyz:4000/api/v1/musicstreet';

export const registerStreet = async (street_name, street_radius, range_color, coordinate, address, music) => {

  let token = await AsyncStorage.getItem('mytoken');

  if(music === null || typeof music === 'undefined') {   // 검색화면에서 바로 새로운 거리 추가 했을 때
    return axios({
      method: 'POST',
      url: `${ROOT_URL}/register`,
      headers: {
        'Authorization': token
      },
      data: {
        street_name: street_name,
        street_radius: street_radius,
        range_color: range_color,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        address: address
      }
    }).then(checkStatus)
      .then( res => {
        console.log('who are you');
        Actions.home();
        return res;
    }).catch( err => {
        throw err;
    });
  } else {
    return axios({
      method: 'POST',
      url: `${ROOT_URL}/register`,
      headers: {
        'Authorization': token
      },
      data: {
        street_name: street_name,
        street_radius: street_radius,
        range_color: range_color,
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        track: music.track,
        likes: music.likes,
        plays_back: music.plays_back,
        artist_url: music.artist_url,
        stream_url: music.stream_url,
        duration: music.duration,
        address: address
      }
    }).then(checkStatus)
      .then( res => {
        console.log("are you working?");
        Actions.tabmain({type: 'refresh'});
        return res;
    }).catch( err => {
        throw err;
    });
  }
}

export const addMusicToStreet = async (id, music) => {
  let token = await AsyncStorage.getItem('mytoken');

  return axios({
    method: 'POST',
    url: `${ROOT_URL}/addMusic/${id}`,
    headers: {
      'Authorization': token,
    },
    data: {
      track: music.track,
      likes: music.likes,
      plays_back: music.plays_back,
      artist_url: music.artist_url,
      stream_url: music.stream_url,
      duration: music.duration
    }
  }).then(checkStatus)
    .then( res => {
      Actions.search({type: 'refresh'});
      return res;
  }).catch( err => {
      throw err;
  });
}

export const getUserStreets = async () => {
  let token = await AsyncStorage.getItem('mytoken');

  console.log(token);
  return axios({
    method: 'GET',
    url: `${ROOT_URL}`,
    headers: {
      Authorization: token
    }
  }).then(checkStatus)
    .then( res => {
      return res;
  }).catch( err => {
      throw err;
  });
}

export const getWholeStreets = () => {
  return axios({
    method: 'GET',
    url: `${ROOT_URL}/whole`,
  }).then(checkStatus)
    .then( res => {
        return res;
  }).catch( err => {
        throw err;
  });
}

export const setPlayList = (musiclist) => {
  return new Promise((resolve, reject) => {
    resolve(musiclist);
  });
}
