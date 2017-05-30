import React, { PropTypes, Component } from 'react';

import { Container, Text, Button, Footer } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { Home, Search, MyPage, MyMusicMap, MusicBar, MyStreetView } from '../components';

const contextTypes = {
  drawer: PropTypes.object
};

const propTypes = {
  name: PropTypes.string,
  title: PropTypes.string
};

class TabView extends Component {
  constructor(props, context) {
    super(props, context);

    this.renderComponent = this.renderComponent.bind(this);
  }

  renderComponent(props) {

    switch(props.title) {
      case 'MyMusicMap':
        return <MyMusicMap {...this.props}/>;
      case 'Search':
        return <Search/>;
      case 'Funtasy Street':
        return <Home/>;
      case 'MyStreetView':
        return <MyStreetView/>;
      case 'MyPage':
        return <MyPage/>;
      default:
        return <Text>Hi</Text>;
    }
  }

  render() {
    const { props, context, renderComponent } = this;
    const drawer = context.drawer;
    console.log(this.props);
    return (
      <Container>
        {renderComponent(props)}
      </Container>
    );
  }
}


TabView.contextTypes = contextTypes;
TabView.propTypes = propTypes;

export default TabView;
