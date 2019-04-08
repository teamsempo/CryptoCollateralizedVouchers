import React, { Component } from 'react';
import Router from './Router';

import 'semantic-ui-css/semantic.min.css'

interface Props {
  web3: object
}

class App extends Component {
  render() {
    return (
    <Router/>
    );
  }
}

export default App;
