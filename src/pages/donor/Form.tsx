import React from 'react';

import Input from './Input'
import styles from './Form.module.css'
import { Icon } from 'semantic-ui-react';

// import coin from "../../ethereum/coin"
// let web3 = require("../../ethereum/web3")

interface OwnState {
  isApproving: boolean;
  isApproved: boolean;
  convertAmount: string;
}

class _Form extends React.Component<{}, OwnState> {

  state = {
    isApproving: false,
    isApproved: false,
    convertAmount: ''
  };

  componentDidMount() {
    this.getCoinBalance()
    this.approve(1)
  }

  async getAccount() {
    return await window.web3.eth.getAccounts().then((accounts: string[]) => accounts[0]);
  }

  async getCoinBalance(){

    console.log('web3 is', window.web3.eth);

    return await window.coin.methods.balanceOf(this.getAccount())
      .call()
      .then((result: number) => {
        // let dappAmount = this.ERCToDappAmount(result, 18);
        // this.setState({coinBalance: dappAmount});
        console.log('balance is:',result);
        return result
      })
  }

  ERCToDappAmount(amount: number, decimals: number) {
    return amount / 10**decimals
  }

  DappToERC20Amount(amount: number, decimals: number) {
    return amount * 10**decimals
  }

  async approve(amount: number) {
    let ERC20amount = this.DappToERC20Amount(amount, 18);

    return await window.coin.methods.approve(
      '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',ERC20amount.toString()).send({from: await this.getAccount()})
      .then((receipt: any) => {
        console.log(receipt)
      });
  }

  async wrapCoin(amount: number) {
    let balance = await this.getCoinBalance();

    if (balance < amount) {
      throw "Not Enough Balance"
    }

    let ERC20amount = this.DappToERC20Amount(amount, 18);

    return await window.voucher.methods.wrapTokens(ERC20amount.toString(), this.getAccount()).send({from: await this.getAccount()})
      .then((receipt: any) => {
        console.log(receipt)
      });

  }

  handleClick() {
    this.setState({isApproving: true})
  };

  render() {
    const {convertAmount, isApproving, isApproved} = this.state;

    const shouldPulse = convertAmount !== '' && !isApproving && !isApproved;
    return (
      <div className={styles.formContainer}>
        <Input
          label="Amount to convert"
          value={convertAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
              isApproving: false,
              convertAmount: e.target.value
            })
          }}
        />

        <div className={styles.bottomSection}>
          <div className={`${styles.iconContainer} ${shouldPulse && styles.pulse}`} onClick={() => this.handleClick()}>
            <Icon name={isApproving ? 'spinner' : "check circle outline"} loading={isApproving} size="big" color="grey" />
          </div>
        </div>
      </div>
    )
  }
}

export default _Form;
