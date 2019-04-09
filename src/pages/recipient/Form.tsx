import React from 'react';

import Input from './Input'
import styles from './Form.module.css'
import { Icon } from 'semantic-ui-react';

interface OwnState {
  userBalance?: number;
  canUnwrap: boolean;
  unwrapAmount: string;
  isUnwrapping: boolean;
}

class _Form extends React.Component<{}, OwnState> {

  state = {
    canUnwrap: false,
    unwrapAmount: '',
    userBalance: 0,
    isUnwrapping: false,
};

  componentDidMount() {
    this.checkCanUnwrap();
    this.getVoucherBalance();

  }

  private getAccount():Promise<string> {
    return window.web3.eth.getAccounts().then((accounts: string[]) => accounts[0]);
  }

  async getVoucherBalance():Promise<number> {
    const account:string = await this.getAccount();

    return window.voucher.methods.balanceOf(account)
      .call()
      .then((result: number) => {
        const userBalance = this.eRCToDappAmount(result);
        this.setState({
          userBalance
        })
      })
  }

  async checkCanUnwrap():Promise<number> {
    const account:string = await this.getAccount();

    return window.voucher.methods.approvedUnwrappers(account)
      .call()
      .then((result: boolean) => {
        this.setState({
          canUnwrap: result
        })
      })
  }

  private eRCToDappAmount(amount: number):number {
    return amount / 10**18
  }

  private dappToERC20Amount(amount: number) {
    return amount * 10**18
  }

  async unwrapCoin(amount: number):Promise<any> {

    console.log('balance is:', this.state.userBalance);
    console.log('amount is:', amount);

    if (this.state.userBalance < amount) {
      alert("Not enough balance")
    } else {
      let ERC20amount = this.dappToERC20Amount(amount);

      return window.voucher.methods.unwrapTokens(ERC20amount.toString()).send({from: await this.getAccount()})
        .on('confirmation', (confirmationNumber:number) => {
          if (confirmationNumber === 1) {
            this.setState({
              isUnwrapping: false
            });
            this.getVoucherBalance();
          }
        })
        .on('error', (error:any) => {
          alert(`Error: ${error}`);
        });
    }
  }

  handleClick() {
    this.setState({isUnwrapping: true});
    this.unwrapCoin(Number(this.state.unwrapAmount))
  };

  render() {
    const {unwrapAmount, isUnwrapping} = this.state;

    const shouldPulse = isUnwrapping;
    return (
      <div className={styles.formContainer}>
      <div style={{color: 'black'}}>
      {this.state.userBalance}
      </div>
        <Input
          label="Amount to Unwrap"
          value={unwrapAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
              isUnwrapping: false,
              unwrapAmount: e.target.value
            })
          }}
        />

        <div className={styles.bottomSection}>
          <div className={`${styles.iconContainer} ${shouldPulse && styles.pulse}`} onClick={() => this.handleClick()}>
            <Icon name={isUnwrapping ? 'spinner' : "check circle outline"} loading={isUnwrapping} size="big" color="grey" />
          </div>
        </div>
      </div>
    )
  }
}

export default _Form;
