import React from 'react';

import Input from './Input'
import styles from './Form.module.css'
import { Icon } from 'semantic-ui-react';

// import coin from "../../ethereum/coin"
// let web3 = require("../../ethereum/web3")

interface OwnState {
  userBalance: string;
  isApproving: boolean;
  isApproved: boolean;
  convertAmount: string;
}

class _Form extends React.Component<{}, OwnState> {

  state = {
    isApproving: false,
    isApproved: false,
    convertAmount: '',
    userBalance: '',
  };

  componentDidMount() {
    this.getCoinBalance();
    // this.approve(10);
    this.wrapCoin(4)
  }

  private getAccount():Promise<string> {
    return window.web3.eth.getAccounts().then((accounts: string[]) => accounts[0]);
  }

  async getCoinBalance():Promise<number> {
    const account:string = await this.getAccount();

    return window.coin.methods.balanceOf(account)
      .call()
      .then((result: number) => {
        // let dappAmount = this.ERCToDappAmount(result, 18);
        // this.setState({coinBalance: dappAmount});
        const userBalance = String(this.eRCToDappAmount(result))
        this.setState({
          userBalance
        })
      })
  }

  private eRCToDappAmount(amount: number):number {
    return amount / 10**18
  }

  private dappToERC20Amount(amount: number) {
    return amount * 10**18
  }

  async approve(amount: number) {
    let ERC20amount = this.dappToERC20Amount(amount);

    return await window.coin.methods.approve(
      '0x61c5a0c36239943093e21eb9ba45ee1308df2d86',ERC20amount.toString()).send({from: await this.getAccount()})
      .then((receipt: any) => {
        console.log(receipt)
      });
  }

  async wrapCoin(amount: number):Promise<any> {
    let balance = await this.getCoinBalance();
    this.setState({
      userBalance: String(balance)
    });

    if (balance < amount) {
      throw "Not Enough Balance"
    }

    let ERC20amount = this.dappToERC20Amount(amount);

    const account:string = await this.getAccount();

    return window.voucher.methods.wrapTokens(ERC20amount.toString(), account).send({from: account})
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
      <div style={{color: 'black'}}>
      {this.state.userBalance}
      </div>
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
