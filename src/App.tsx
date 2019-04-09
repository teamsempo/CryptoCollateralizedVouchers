import React, { Component } from 'react';
import Router from './Router';
import 'semantic-ui-css/semantic.min.css'

import ERC20ABI from "./ABIs/ERC20"
import VoucherABI from "./ABIs/StableVoucher"


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
  voucher: any;
  constructor(props: any) {
    super(props);

    this.state = {
      account: '',
      coinBalance: undefined
    };

    this.coin = new window.web3.eth.Contract(
      ERC20ABI,
      this.props.activeNetwork.coinContractAddr
    );

    this.voucher = new window.web3.eth.Contract(
      VoucherABI,
      this.props.activeNetwork.voucherContractAddr
    );

  }

  componentDidMount() {
    window.web3.eth.getAccounts().then((result: string[]) => {
      this.setState({
        account: result[0]
      },
        () => {
          this.getCoinBalance();
        })
    })
  }

  ERCToDappAmount(amount: number, decimals: number) {
    return amount / 10**decimals
  }

  DappToERC20Amount(amount: number, decimals: number) {
    return amount * 10**decimals
  }

  async getCoinBalance(){
    return this._getBalance(this.coin,this.props.activeNetwork.coinDecimals);
  }

  async _getBalance(token: any, decimals: number) {
    return await token.methods.balanceOf(this.state.account)
      .call()
      .then((result: number) => {
        let dappAmount = this.ERCToDappAmount(result, decimals);
        this.setState({coinBalance: dappAmount});
        console.log('balance is:',dappAmount);
        return result
      })
  }

  async approve(amount: number) {
    let ERC20amount = this.DappToERC20Amount(amount, this.props.activeNetwork.coinDecimals);

    return await this.coin.methods.approve(this.props.activeNetwork.voucherContractAddr,ERC20amount.toString()).send({from: this.state.account})
      .then((receipt: any) => {
        console.log(receipt)
      });
  }

  async wrapCoin(amount: number) {
    let balance = await this.getCoinBalance();

    if (balance < amount) {
      throw "Not Enough Balance"
    }

    let ERC20amount = this.DappToERC20Amount(amount, this.props.activeNetwork.coinDecimals);

    return await this.voucher.methods.wrapTokens(ERC20amount.toString(), this.state.account).send({from: this.state.account})
      .then((receipt: any) => {
        console.log(receipt)
      });

  }

  render() {
    return (
    <Router
      approve={(amount: number) => this.approve(amount)}
      wrapCoin={(amount: number) => this.approve(amount)}
    />
    );
  }
}

export default App;
