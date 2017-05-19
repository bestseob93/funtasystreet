import React, { Component } from 'react';
import { View, Text, Modal } from 'react-native';
import { Container, Header, Left, Button, Icon, Body, Title, Right, Content } from 'native-base';
import { Actions } from 'react-native-router-flux';

class MyMusicMapFill extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: true
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(visible) {
    this.setState({
      modalVisible: visible
    });
  }

  render() {
    const { toggleModal } = this;
    const { modalVisible } = this.state;
    return (
      <Modal
        animationType={"none"}
        transparent={false}
        visible={modalVisible}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={()=> Actions.pop}>
                <Icon name='arrow-back'/>
              </Button>
            </Left>
            <Body>
              <Title>My Music Map</Title>
            </Body>
            <Right>
              <Button transparent>
                <Text>완료</Text>
              </Button>
            </Right>
          </Header>
          <Content>
            <Text>aaa</Text>
          </Content>
        </Container>
      </Modal>
    );
  }
}

export default MyMusicMapFill;
