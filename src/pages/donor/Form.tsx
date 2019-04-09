import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import swal from 'sweetalert';

import Section from './Section';
import Input from './Input';
import styles from './Form.module.css';
import { voucherAddress } from '../../constants';

interface OwnState {
  isApproving: boolean;
  isApproved: boolean;

  isWrapping: boolean;
  isWrapped: boolean;

  amount: string;

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

    amount: '',
    balance: '',
    account: ''
  };

  componentDidMount() {
    this.getAccount().then(this.getCoinBalance);
  }

  private getAccount(): Promise<void> {
    return window.web3.eth
      .getAccounts()
      .then((accounts: string[]) => this.setState({ account: accounts[0] }));
  }

  private getCoinBalance = (): Promise<number> => {
    const { account } = this.state;

    return window.coin.methods
      .balanceOf(account)
      .call()
      .then((result: number) => {
        // let dappAmount = this.ERCToDappAmount(result, 18);
        // this.setState({coinBalance: dappAmount});
        const balance = String(this.eRCToDappAmount(result));
        this.setState({
          balance
        });
      });
  };

  private eRCToDappAmount(amount: number): number {
    return amount / 10 ** 18;
  }

  private dappToERC20Amount(amount: number) {
    return amount * 10 ** 18;
  }

  approve(amount: number) {
    let ERC20amount = this.dappToERC20Amount(amount);

    this.setState({ isApproving: true });
    return window.coin.methods
      .approve(voucherAddress, ERC20amount.toString())
      .send({ from: this.state.account })
      .on('confirmation', (confirmationNumber: number) => {
        if (confirmationNumber === 1) {
          this.setState({
            isApproving: false,
            isApproved: true
          });
        }
      })
      .on('error', (error: any) => {
        alert(`Error: ${error}`);
      });
  }

  wrapCoin(amount: number): Promise<any> {
    const { balance, account } = this.state;
    if (Number(balance) < amount) {
      alert('Not Enough Balance');
    }

    let ERC20amount = this.dappToERC20Amount(amount);

    this.setState({ isWrapping: true });
    return window.voucher.methods
      .wrapTokens(ERC20amount.toString(), account)
      .send({ from: this.state.account })
      .on('confirmation', (confirmationNumber: number) => {
        if (confirmationNumber === 1) {
          this.setState({
            isWrapping: false,
            isWrapped: true
          });
          this.getCoinBalance();
        }
      })
      .on('error', (error: any) => {
        alert(`Error: ${error}`);
      });
  }

  handleApproveClick() {
    const { balance, amount } = this.state;
    if (Number(amount) <= 0) {
      swal(
        'Error',
        `An amount of ${amount} is invalid. Your request has been stopped.`,
        'error'
      );
      return;
    }
    if (Number(amount) > Number(balance)) {
      swal(
        'Error',
        `A request of ${amount} is more than you have. Your request has been stopped.`,
        'error'
      );
      return;
    }

    this.approve(Number(amount));
  }

  handleWrapClick() {
    const { balance } = this.state;
    const amount = Number(this.state.amount);
    if (amount > Number(balance)) {
      alert(
        `Woops! You cannot voucher ${amount} Dai since your account balance is ${balance} `
      );
      return;
    }

    this.wrapCoin(amount);
  }

  render() {
    const {
      amount,
      isApproving,
      isApproved,
      isWrapping,
      isWrapped
    } = this.state;

    const shouldPulse = amount !== '' && !isApproving && !isApproved;
    return (
      <div className={styles.formContainer}>
        <div style={{ color: 'black' }}>
          <Section>
            <div>
              You have
              <h1
                style={{
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  marginRight: '8px'
                }}
              >
                {' '}
                {this.state.balance} Dai{' '}
              </h1>
            </div>
          </Section>
        </div>
        <Input
          label="Amount to convert"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
              isApproved: false,
              isApproving: false,
              amount: e.target.value
            });
          }}
        />

        <div
          className={`${styles.bottomSection} ${isApproved &&
            styles.doubleBottom}`}
        >
          <Popup
            disabled={isApproved}
            position="right center"
            trigger={
              <div
                className={`${styles.iconContainer} ${shouldPulse &&
                  styles.pulse}`}
                onClick={() => this.handleApproveClick()}
              >
                <Icon
                  name={isApproving ? 'spinner' : 'check circle outline'}
                  loading={isApproving}
                  size="big"
                  color={isApproved ? 'green' : 'grey'}
                  disabled={isApproved || isApproving}
                />
              </div>
            }
            content={`Request approval for ${amount} Dai`}
          />

          {isApproved && (
            <Popup
              disabled={isWrapped}
              position="right center"
              trigger={
                <div
                  className={`${styles.iconContainer} ${shouldPulse &&
                    styles.pulse}`}
                  onClick={() => this.handleWrapClick()}
                >
                  <Icon
                    name={isWrapping ? 'spinner' : 'send'}
                    loading={isWrapping}
                    size="big"
                    color={isWrapped ? 'green' : 'grey'}
                    disabled={isWrapped || isWrapping}
                  />
                </div>
              }
              content={`Send ${amount} Dai`}
            />
          )}
        </div>
      </div>
    );
  }
}

export default _Form;
