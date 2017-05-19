import * as helper from '../helpers/maps.helper';

export const GET_CURRENT_ADDRESS = "GET_CURRENT_ADDRESS";

export const getCurrentAddress = (lat, lng) => ({
  type: GET_CURRENT_ADDRESS,
  payload: {
    promise: helper.getCurrentAddress(lat, lng)
  }
});

const requests = {
    fetching: false,
    fetched: false,
    errorCode: null,
    errorMessage: ''
};

const initialState = {
  address: '',
  position: {
    lat: 0,
    lng: 0
  },
  request: { ...requests }
};

const pending = {fetching: true, fetched: false, errorCode: null, errorMessage: ''};
const fulfilled = {fetching: false, fetched: true, errorCode: null, errorMessage: ''};
const rejected = {fetching: false, fetched: false};

export default function reducer(state=initialState, action) {
  const payload = action.payload;
  console.log(payload);
  // if(Array.isArray(payload)) {
  //   console.log(payload[0]);
  // }

  switch(action.type) {
    case `${GET_CURRENT_ADDRESS}_PENDING`:
      return {
        ...state,
        request: { ...pending }
      };
    case `${GET_CURRENT_ADDRESS}_FULFILLED`:
      return {
        address: payload.data.results[3].formatted_address,
        position: {
          lat: payload.data.results[3].geometry.location.lat,
          lng: payload.data.results[3].geometry.location.lng
        },
        request: { ...fulfilled }
      };
    case `${GET_CURRENT_ADDRESS}_REJECTED`:
      return {
        ...state,
        request: { ...rejected }
      };
    default:
      return state;
  };
};
