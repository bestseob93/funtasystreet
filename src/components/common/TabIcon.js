import React, { PropTypes } from 'react';
import { Text, Image } from 'react-native';
import { Icon } from 'native-base';

const propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string
};

const TabIcon = (props) => {
  if(props.sceneName === 'mymusicmap') {
    return (
      <Image style={{width:35, height:35}} source={require('./funtasy_street_logo/funtasy_street_logo_2.png')}/>
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
