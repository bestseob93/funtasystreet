import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { checkStatus } from './checkStatus';

const ROOT_URL = 'http://kkoong-feed.xyz:4000/api/v1/account';

const setStorage = async (receivedToken) => {
    try {
      await AsyncStorage.setItem('mytoken', receivedToken);
    } catch (error) {
      console.log(error);
    }
};

const getStorage = async () => {
  try {
    var valueToken = await AsyncStorage.getItem('mytoken');
    console.log(valueToken);
    if (valueToken !== null) {
      // 로그인 정보 status 보내기.
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const loginUser = (useremail, password) => {
  return axios({
    method: 'POST',
    url: `${ROOT_URL}/signIn`,
    data: {
      useremail,
      password
    }
  }).then(checkStatus)
    .then( res => {
      console.log(res.data.token);
      const receivedToken = res.data.token;
      setStorage(receivedToken);
      Actions.tabmain({type: 'reset'});
      return res;
  }).catch( err => {
      throw err;
  });
};

export const registerUser = (useremail, password) => {
  return axios({
    method: 'POST',
    url: `${ROOT_URL}/signUp`,
    data: {
      useremail,
      password
    }
  }).then(checkStatus)
    .then( res => {
      console.log(res.data.token);
      const receivedToken = res.data.token;
      setStorage(receivedToken);
      Actions.tabmain();

      return res;
  }).catch( err => {
      throw err;
  });
};

export const logoutUser = () => {
  return axios({
    method: 'POST',
    url: `${ROOT_URL}/logout`
  }).then(checkStatus)
    .then( res => {
      return true;
  }).catch( err => {
    throw err;
  });
}

export const checkAuthStatus = () => {
  console.log(getStorage());
  return getStorage();
};
