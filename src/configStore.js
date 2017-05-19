import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import promiseMiddleware from 'redux-promise-middleware';

const logger = createLogger();
console.log('redux log..');
console.log(logger);

const middlewares = [thunk, promiseMiddleware()];

middlewares.push(logger);

const configStore = createStore(rootReducer, applyMiddleware(...middlewares));

export default configStore;
