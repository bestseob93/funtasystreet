import axios from 'axios';
import { checkStatus } from './checkStatus';

const ROOT_URL = 'http://kkoong-feed.xyz:4000/api/v1/musicstreet';

export const fetchSearchResults = (searchResult) => {
  return axios({
    method: 'GET',
    url: `${ROOT_URL}/search/${searchResult}`
  }).then(checkStatus)
    .then( res => {
      return res;
  }).catch( err => {
      throw err;
  });
}

export const fetchNextResults = (nextUrl, nowPage) => {
  // console.log(nextUrl);
  return axios({
    method: 'GET',
    url: nextUrl
  }).then(checkStatus)
    .then( res => {
      return {res, nowPage};
  }).catch( err => {
      throw err;
  });
}
