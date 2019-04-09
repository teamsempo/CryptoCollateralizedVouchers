import React, { Component } from 'react';

import 'semantic-ui-css/semantic.min.css';

import Router from './Router';
let web3 = require('./ethereum/web3').default;

import { coinAddress, voucherAddress } from './constants';
import { routes } from './routes';

interface Props {}

interface State {
  account: string;
  coinBalance?: number;
  hasEth: boolean;
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      account: '',
      hasEth: false,
      coinBalance: undefined
    };
  }

  componentDidMount() {
    this.consoleLogDevInfo();
    let timer = setTimeout(() => {
      if (web3.eth) {
        this.setState({ hasEth: true });
        clearTimeout(timer);
      }
    }, 500);
  }

  private consoleLogDevInfo = () => {
    console.groupCollapsed('Dev Info');
    console.log({
      coinAddress,
      voucherAddress,
      routes
    });
    console.groupEnd();
  };

  render() {
    if (this.state.hasEth) {
      return <Router />;
    }

    return <div>Loading...</div>;
  }
}

export default App;
