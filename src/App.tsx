import React, { Component } from 'react';
import Router from './Router';
import 'semantic-ui-css/semantic.min.css'

import ERC20ABI from "./ABIs/StableVoucher"

import { Network } from "./index"

interface Props {
    activeNetwork: Network
}

interface State {
  account: string;
  coinBalance?: number;
}

class App extends Component<Props, State>  {

  coin: any;
  constructor(props: any) {
    super(props);

    this.state = {
      account: '',
      coinBalance: undefined
    };

    this.coin = new window.web3.eth.Contract(
      ERC20ABI,
      this.props.activeNetwork.coinContractAddr
    )

  }

  componentDidMount() {
    window.web3.eth.getAccounts().then((result: string[]) => {
      this.setState({
        account: result[0]
      },
        () => {
          this.getCoinBalance()
        })
    })
  }

  async getCoinBalance(){
    return this._getBalance(this.coin,this.props.activeNetwork.coinDecimals);
  }

  async _getBalance(token: any, decimals: number) {
    return await token.methods.balanceOf(this.state.account)
      .call()
      .then((result: number) => {
        this.setState({coinBalance: result /10**decimals});
        console.log('balance is:', result /10**decimals);
        return result
      })
  }

  render() {
    return (
    <Router/>
    );
  }
}

export default App;
