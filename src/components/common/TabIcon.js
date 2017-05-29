import React, { PropTypes } from 'react';
import { Text, Image } from 'react-native';
import { Icon } from 'native-base';
import SLIcon from 'react-native-vector-icons/SimpleLineIcons';
const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string
};

const TabIcon = (props) => {
  if(props.sceneName === 'home') {
    return (
      <Image style={{width:28, height:28}} source={require('./funtasy_street_logo/funtasy_street_logo_2.png')}/>
    );
  } else if(props.sceneName === 'search') {
    return (
      <Icon name="search"
            ios={ props.selected ? `ios-${props.sceneName}` : `ios-${props.sceneName}-outline`}
            active={props.selected ? true : false}
            style={{ backgroundColor: 'white', color: 'black'}}
            fontSize={14}
      />
    );
  } else if(props.sceneName === 'mymusicmap') {
    return (
      <Icon name="add-circle" ios="ios-add-circle-outline" fontSize={14}/>
    );
  } else {
    return (
      <Icon name={props.sceneName}
            ios={ props.selected ? `ios-${props.sceneName}` : `ios-${props.sceneName}-outline`}
            active={props.selected ? true : false}
            style={{ backgroundColor: 'white', color: 'black'}}
            fontSize={14}
      />
    );
  }
};

TabIcon.propTypes = propTypes;

export { TabIcon };
