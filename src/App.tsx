import React, { Component } from 'react';
import Router from './Router';
import 'semantic-ui-css/semantic.min.css'
import {timeout} from "q";
let web3 = require("./ethereum/web3").default;

interface Props {
}

interface State {
  account: string;
  coinBalance?: number;
  hasEth: boolean

}

class App extends Component<Props, State>  {

  constructor(props: any) {
    super(props);

    this.state = {
      account: '',
      hasEth: false,
      coinBalance: undefined
    };
  }

  componentDidMount() {
    let timer = setTimeout(() =>{
      console.log('web3 is', web3)
      if (web3.eth) {
        this.setState({hasEth: true});
        clearTimeout(timer)
      }
    },500)
  }

  ERCToDappAmount(amount: number, decimals: number) {
    return amount / 10**decimals
  }

  DappToERC20Amount(amount: number, decimals: number) {
    return amount * 10**decimals
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

  // async approve(amount: number) {
  //   let ERC20amount = this.DappToERC20Amount(amount, this.props.activeNetwork.coinDecimals);
  //
  //   return await this.coin.methods.approve(this.props.activeNetwork.voucherContractAddr,ERC20amount.toString()).send({from: this.state.account})
  //     .then((receipt: any) => {
  //       console.log(receipt)
  //     });
  // }
  //
  // async wrapCoin(amount: number) {
  //   let balance = await this.getCoinBalance();
  //
  //   if (balance < amount) {
  //     throw "Not Enough Balance"
  //   }
  //
  //   let ERC20amount = this.DappToERC20Amount(amount, this.props.activeNetwork.coinDecimals);
  //
  //   return await this.voucher.methods.wrapTokens(ERC20amount.toString(), this.state.account).send({from: this.state.account})
  //     .then((receipt: any) => {
  //       console.log(receipt)
  //     });
  //
  // }

  render() {
    if (this.state.hasEth) {
      return (
        <Router
          // approve={(amount: number) => this.approve(amount)}
          // wrapCoin={(amount: number) => this.approve(amount)}
        />
      );
    }

    return(
      <div>
        Loading...
      </div>
    )
  }
}

export default App;
