import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';

import configStore from './configStore';
import Router from './Router';

class App extends Component {
  render() {
    console.log('bte');
    return (
      <Provider store={configStore}>
        <Router/>
      </Provider>
    );
  }
}

export default App;
