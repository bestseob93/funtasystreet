import React, { PropTypes } from 'react';
import { Text, Image } from 'react-native';
import { Icon } from 'native-base';

const propTypes = {
  selected: PropTypes.bool
};

const MyMusicMapIcon = (props) => (
    <Image source={require('./funtasy_street_logo/funtasy_street_logo_2.png')}/>
);

MyMusicMapIcon.propTypes = propTypes;

export { MyMusicMapIcon };
