import React, { Component, PropTypes } from 'react';
import { Container, Header, Toast, Item, Input, Icon, Button, Text } from 'native-base';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { CommonSpinner } from '../common';
import { SearchList } from './searchbox';

import * as search from '../../ducks/search.duck';
import * as music from '../../ducks/music.duck';

const propTypes = {
  SearchActions: PropTypes.object
};

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      keywords: '',
      isInputFocused: false
    };

    this.onButtonPress = this.onButtonPress.bind(this);
    this.onMusicSelect = this.onMusicSelect.bind(this);
    this.toggleCancelButton = this.toggleCancelButton.bind(this);
  }

  onButtonPress() {
    const { SearchActions } = this.props;

    SearchActions.requestSearch(this.state.keywords);
    this.setState({
      isInputFocused: !this.state.isInputFocused
    })
  }

  onMusicSelect(selectedMusic) {
    const { MusicActions } = this.props;
    MusicActions.requestMusicSel(selectedMusic);
  }

  toggleCancelButton() {
    this.setState({
      isInputFocused: !this.state.isInputFocused
    });
  }

  componentWillUnMount() {
    this.setState({
      isInputFocused: false
    });
  }

  render() {
    const { onButtonPress, onScrollUp, onMusicSelect, toggleCancelButton } = this;
    const { searchData, searchPage, SearchActions, searchFetching, nextFetching, nextFetched } = this.props;
    const renderSearchButton = () => {
      return (
        <Button transparent onPress={onButtonPress}>
          <Text>
            검색
          </Text>
        </Button>
      )
    };

    return (
      <Container>
        <Header searchBar rounded style={styles.headerStyle}>
          <Item>
            <Icon name="search"/>
            <Input placeholder="음악 검색"
                   keyboardType="default"
                   autoCapitalize="none"
                   onChangeText={(text) => {this.setState({keywords: text})}}
                   value={this.state.keywords}
                   blurOnSubmit={false}
                   onFocus={toggleCancelButton}/>
          </Item>
          { this.state.isInputFocused ? renderSearchButton() : (<Text></Text>
          )}

        </Header>
        {searchFetching ? <CommonSpinner/> :
          <SearchList refresh={onButtonPress}
                      isFetching={nextFetching}
                      isFetched={nextFetched}
                      data={searchData.result}
                      nextAction={SearchActions}
                      nextHref={searchData.nextHref}
                      nowPage={searchPage}
                      musicSel={onMusicSelect}/>}
      </Container>
    );
  }
}

Search.propTypes = propTypes;

const styles = {
  headerStyle: {
    marginTop: 0
  }
};

export default connect(
  state => {
    return {
      searchData: {
        result: state.search.searchResults.result,
        nextHref: state.search.searchResults.next_href
      },
      searchPage: state.search.pagination.page,
      searchFetching: state.search.request.fetching
    };
  },
  dispatch => {
    return {
      SearchActions: bindActionCreators({
        requestSearch: search.requestSearchResult,
        requestNext: search.requestNextResult
      }, dispatch),
      MusicActions: bindActionCreators({
        requestMusicSel: music.playSelectedMusic
      }, dispatch)
    };
  }
)(Search);
