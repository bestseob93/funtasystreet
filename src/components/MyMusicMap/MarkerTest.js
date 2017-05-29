import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { Icon } from 'native-base';

const propTypes = {
  myStreetIcon: PropTypes.string,
  fontSize: PropTypes.number,
};

const defaultProps = {
  fontSize: 13,
};

class MarkerTest extends React.Component {
  render() {
    const { fontSize, myStreetIcon } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.bubble}>
          {/*<Text style={[styles.myStreetName, { fontSize }]}>{myStreetName}</Text>*/}
          <Icon style={{color: '#fff', fontSize: 13}} name={myStreetIcon}/>
        </View>
        <View style={styles.arrowBorder}/>
        <View style={styles.arrow}/>
      </View>
    );
  }
}

MarkerTest.propTypes = propTypes;
MarkerTest.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  bubble: {
    flex: 0,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#66a0ff',
    padding: 2,
    borderRadius: 3,
    borderColor: '#66a0ff',
    borderWidth: 0.5,
  },
  myStreetName: {
    color: '#FFF',
    fontSize: 13,
  },
  arrow: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#66a0ff',
    alignSelf: 'center',
    marginTop: -9,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#66a0ff',
    alignSelf: 'center',
    marginTop: -0.5,
  },
});

module.exports = MarkerTest;
