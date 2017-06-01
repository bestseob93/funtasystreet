import * as helper from '../helpers/maps.helper';

export const GET_CURRENT_ADDRESS = "GET_CURRENT_ADDRESS";
export const REQUEST_COMPARE_STREET = "REQUEST_COMPARE_STREET";

export const getCurrentAddress = (lat, lng) => ({
  type: GET_CURRENT_ADDRESS,
  payload: {
    promise: helper.getCurrentAddress(lat, lng)
  }
});

export const requestCompareStreet = (streetName) => ({
  type: REQUEST_COMPARE_STREET,
  payload: {
    promise: helper.compareStreet(streetName)
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
  street_name: '',
  position: {
    lat: 0,
    lng: 0
  },
  request: { ...requests },
  compareRequest: { ...requests }
};

const pending = {fetching: true, fetched: false, errorCode: null, errorMessage: ''};
const fulfilled = {fetching: false, fetched: true, errorCode: null, errorMessage: ''};
const rejected = {fetching: false, fetched: false};

export default function reducer(state=initialState, action) {
  const payload = action.payload;
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
    case `${REQUEST_COMPARE_STREET}_PENDING`:
      return {
        ...state,
        compareRequest: { ...pending }
      };
    case `${REQUEST_COMPARE_STREET}_FULFILLED`:
      return {
        ...state,
        street_name: payload,
        compareRequest: { ...fulfilled }
      };
    case `${REQUEST_COMPARE_STREET}_REJECTED`:
      return {
        ...state,
        compareRequest: { ...rejected }
      }
    default:
      return state;
  };
};
