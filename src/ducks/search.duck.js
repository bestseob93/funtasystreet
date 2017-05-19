import { fetchSearchResults, fetchNextResults } from '../helpers/search.helper';

export const REQUEST_SEARCH_RESULTS = 'REQUEST_SEARCH_RESULTS';
export const REQUEST_NEXT_RESULTS = 'REQUEST_NEXT_RESULTS';


export const requestSearchResult = (searchResult) => ({
  type: REQUEST_SEARCH_RESULTS,
  payload: {
    promise: fetchSearchResults(searchResult)
  }
});

export const requestNextResult = (nowPage) => ({
  type: REQUEST_NEXT_RESULTS,
  payload: {
    promise: fetchNextResults(nowPage)
  }
});

const requests = {
  fetching: false,
  fetched: false,
  error: null
};

const searchResults = {
  result: [],
  next_href: ''
};

const pagination = {
  page: 0,
  perPage: null
};

const initialState = {
  request: { ...requests },
  searchResults: { ...searchResults },
  pagination: { ...pagination },
  nextRequest: { ...requests }
};

const pending = {fetching: true, fetched: false, error: null};
const fulfilled = {fetching: false, fetched: true, error: null};
const rejected = {fetching: false, fetched: false};

export default function reducer(state=initialState, action) {
  const payload = action.payload;
  console.log(payload);
  switch(action.type) {
    case `${REQUEST_SEARCH_RESULTS}_PENDING`:
      return {
        ...state,
        request: { ...pending }
      };
    case `${REQUEST_SEARCH_RESULTS}_FULFILLED`:
      return {
        ...state,
        searchResults: {
          result: payload.data.results.collection,
          next_href: payload.data.results.next_href
        },
        pagination: { page: 1, perPage: payload.data.results.collection.length},
        request: { ...fulfilled }
      };
    case `${REQUEST_SEARCH_RESULTS}_REJECTED`:
      return {
        ...state,
        request: { ...rejected, error: payload }
      };
    case `${REQUEST_NEXT_RESULTS}_PENDING`:
      return {
        ...state,
        nextRequest: { ...pending }
      };
    case `${REQUEST_NEXT_RESULTS}_FULFILLED`:
      return {
        ...state,
        searchResults: {
          result: payload.res.data.collection,
          next_href: payload.res.data.next_href
        },
        pagination: { page: payload.nowPage, perPage: payload.res.data.collection.length},
        nextRequest: { ...fulfilled }
      };
    case `${REQUEST_NEXT_RESULTS}_REJECTED`:
      return {
        ...state,
        nextRequest: { ...rejected, error: payload }
      };
    default:
      return state;
  }
}
