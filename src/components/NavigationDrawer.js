// import React, { PropTypes, Component } from 'react';
// import Drawer from 'react-native-drawer';
// import { Container } from 'native-base';
// import { DefaultRenderer, Actions } from 'react-native-router-flux';
//
// import { TabView } from './TabView';
//
// const propTypes = {
//   navigationState: PropTypes.object
// };
//
// class NavigationDrawer extends Component {
//   render() {
//     const state = this.props.navigationState;
//     const children = state.children;
//     return (
//       <Container>
//         <Drawer
//           ref="navigation"
//           type="displace"
//           onOpen={() => Actions.push({ key: state.key, open: true })}
//           onClose={() => Actions.pop({ key: state.key, open: false })}
//           content={<TabView />}
//           tapToClose
//           openDrawerOffset={0.2}
//           panCloseMask={0.2}
//           negotiatePan
//           tweenHandler={(ratio) => ({
//             main: { opacity: Math.max(0.54, 1 - ratio) },
//           })}
//         >
//         </Drawer>
//       </Container>
//     );
//   }
// }
//
// NavigationDrawer.propTypes = propTypes;
//
// export default NavigationDrawer;
