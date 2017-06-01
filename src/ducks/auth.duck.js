import * as helper from '../helpers/auth.helper';

export const AUTH_LOGIN = "AUTH_LOGIN";
export const AUTH_REGISTER = "AUTH_REGISTER";
export const AUTH_LOGOUT = "AUTH_LOGOUT";
export const CHECK_AUTH_STATUS = "CHECK_AUTH_STATUS";

export const localLogin = (useremail, password) => ({
  type: AUTH_LOGIN,
  payload: {
    promise: helper.loginUser(useremail, password)
  }
});

export const localRegister = (useremail, password) => ({
  type: AUTH_REGISTER,
  payload: {
    promise: helper.registerUser(useremail, password)
  }
});

export const localLogout = () => ({
  type: AUTH_LOGOUT,
  payload: {
    promise: helper.logoutUser()
  }
});

export const checkAuthStatus = () => ({
  type: CHECK_AUTH_STATUS,
  payload: helper.checkAuthStatus()
});

const requests = {
    fetching: false,
    fetched: false,
    errorCode: null,
    errorMessage: ''
};

const initialState = {
  request: { ...requests },
  authStatus: {
    isLogged: false
  }
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
    case `${AUTH_LOGIN}_PENDING`:
      return {
        ...state,
        request: { ...pending }
      };
    case `${AUTH_LOGIN}_FULFILLED`:
      return {
        request: { ...fulfilled },
        authStatus: {
          isLogged: true
        }
      };
    case `${AUTH_LOGIN}_REJECTED`:
      return {
        request: { ...rejected },
        authStatus: {
          isLogged: false
        }
      };
    case `${AUTH_REGISTER}_PENDING`:
      return {
        ...state,
        request: { ...pending },
      };
    case `${AUTH_REGISTER}_FULFILLED`:
      return {
        ...state,
        request: { ...fulfilled },
        authStatus: {
          isLogged: true
        }
      };
    case `${AUTH_REGISTER}_REJECTED`:
      return {
        ...state,
        request: { ...rejected, errorCode: payload.response.data.code, errorMessage: payload.response.data.error },
        authStatus: {
          isLogged: false
        }
      };
    case `${CHECK_AUTH_STATUS}_PENDING`:
      return {
        ...state,
        request: { ...pending }
      };
    case `${CHECK_AUTH_STATUS}_FULFILLED`:
      return {
        ...state,
        request: { ...fulfilled },
        authStatus: {
          isLogged: payload
        }
      };
    case `${CHECK_AUTH_STATUS}_REJECTED`:
      return {
        ...state,
        request: { ...rejected },
        authStatus: {
          isLogged: payload
        }
      };
    case `${AUTH_LOGOUT}_PENDING`:
      return {
        ...state,
        request: { ...pending }
      };
    case `${AUTH_LOGOUT}_FULFILLED`:
      return {
        ...state,
        request: { ...fulfilled },
        authStatus: {
          isLogged: false
        }
      };
    case `${AUTH_LOGOUT}_REJECTED`:
      return {
        ...state,
        request: { ...rejected },
        authStatus: {
          isLogged: false
        }
      };
    default:
      return state;
  }
}
