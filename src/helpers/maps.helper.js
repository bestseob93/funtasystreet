import axios from 'axios';
import { checkStatus } from './checkStatus';

export const getCurrentAddress = (lat, lng) => {
  return axios({
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ko&key=AIzaSyAZ4wxXzeheT3jy1dRY-8kyTLdO4Vl0AJI`
  }).then(checkStatus)
    .then( res => {
      return res;
  }).catch( err => {
      throw err;
  });
};

export const compareStreet = (streetName) => {
  return new Promise((resolve, reject) => {
    resolve(streetName);
  });
}