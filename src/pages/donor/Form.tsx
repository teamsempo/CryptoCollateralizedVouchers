import React from 'react';
import { Icon } from 'semantic-ui-react';

import Input from './Input';
import styles from './Form.module.css';
import {voucherAddress} from '../../constants';

interface OwnState {
  isApproving: boolean;
  isApproved: boolean;

  isWrapping: boolean;
  isWrapped: boolean;

  convertAmount: string;

  // from the contract
  balance: string;
  account: string;
}

class _Form extends React.Component<{}, OwnState> {

  state = {
    isApproving: false,
    isApproved: false,

    isWrapping: false,
    isWrapped: false,

    convertAmount: '',
    balance: '',
    account: '',
  };

  componentDidMount() {
    this.getAccount()
      .then(this.getCoinBalance)
  }

  private getAccount():Promise<void> {
    return window.web3.eth.getAccounts()
      .then((accounts: string[]) => this.setState({account: accounts[0]}));
  }

  private getCoinBalance = ():Promise<number> => {
    const {account} = this.state;

    return window.coin.methods.balanceOf(account)
      .call()
      .then((result: number) => {
        // let dappAmount = this.ERCToDappAmount(result, 18);
        // this.setState({coinBalance: dappAmount});
        const balance = String(this.eRCToDappAmount(result))
        this.setState({
          balance
        })
      })
  }

  private eRCToDappAmount(amount: number):number {
    return amount / 10**18
  }

  private dappToERC20Amount(amount: number) {
    return amount * 10**18
  }

  approve(amount: number):Promise<any> {
    let ERC20amount = this.dappToERC20Amount(amount);

    this.setState({isApproving: true})
    return window.coin.methods.approve(
        voucherAddress,ERC20amount.toString())
    .send({from: this.state.account})
    .on('confirmation', (confirmationNumber:number) => {
      if (confirmationNumber === 1) {
        this.setState({
          isApproving: false,
          isApproved: true,
        });
      }
    })
    .on('error', (error:any) => {
      alert(`Error: ${error}`);
    });
  }

  wrapCoin(amount: number):Promise<any> {
    const {balance, account} = this.state;
    if (Number(balance) < amount) {
      alert("Not Enough Balance");
    }

    let ERC20amount = this.dappToERC20Amount(amount);

    this.setState({isWrapping: true})
    return window.voucher.methods.wrapTokens(ERC20amount.toString(), account).send({from: this.state.account})
        .on('confirmation', (confirmationNumber:number) => {
          if (confirmationNumber === 1) {
            this.setState({
              isWrapping: false,
              isWrapped: true,
            });
          }
        })
        .on('error', (error:any) => {
          alert(`Error: ${error}`);
        });
  }

  handleApproveClick() {
    const {balance} = this.state;
    const convertAmount = Number(this.state.convertAmount);
    if (convertAmount > Number(balance)) {
      alert(`Woops! You cannot voucher ${convertAmount} Dai since your account balance is ${balance} `);
      return ;
    }

    this.approve(convertAmount)
  };

  handleWrapClick() {
    const {balance} = this.state;
    const convertAmount = Number(this.state.convertAmount);
    if (convertAmount > Number(balance)) {
      alert(`Woops! You cannot voucher ${convertAmount} Dai since your account balance is ${balance} `);
      return ;
    }

    // success state

    this.wrapCoin(convertAmount)
  };

  render() {
    const {convertAmount, isApproving, isApproved, isWrapping} = this.state;

    const shouldPulse = convertAmount !== '' && !isApproving && !isApproved;
    return (
      <div className={styles.formContainer}>
      <div style={{color: 'black'}}>
      {this.state.balance}
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
          <div className={`${styles.iconContainer} ${shouldPulse && styles.pulse}`} onClick={() => this.handleApproveClick()}>
            <Icon name={isApproving ? 'spinner' : "check circle outline"} loading={isApproving} size="big" color={isApproved ? "green" : "grey"} disabled={isApproved || isApproving}/>
            {isApproved && 'Approved'}
          </div>

      {isApproved &&
          (<div className={`${styles.iconContainer} ${shouldPulse && styles.pulse}`} onClick={() => this.handleWrapClick()}>
            <Icon name={isWrapping ? 'spinner' : "check circle outline"} loading={isWrapping} size="big" color="grey" />
          </div>
            )}
        </div>
      </div>
    )
  }
}

export default _Form;
