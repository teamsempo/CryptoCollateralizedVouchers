import React from 'react';
import { Icon, Popup } from 'semantic-ui-react';
import swal from 'sweetalert';

import Input from './Input';
import styles from './Form.module.css';
import Section from '../donor/Section';

interface OwnState {
  userBalance?: number;
  canUnwrap: boolean;
  unwrapAmount: string;
  isUnwrapping: boolean;
  isUnwrapped: boolean;
}

class _Form extends React.Component<{}, OwnState> {
  state = {
    canUnwrap: false,
    unwrapAmount: '',
    userBalance: 0,
    isUnwrapping: false,
    isUnwrapped: false
  };

  componentDidMount() {
    this.checkCanUnwrap();
    this.getVoucherBalance();
  }

  private getAccount(): Promise<string> {
    return window.web3.eth
      .getAccounts()
      .then((accounts: string[]) => accounts[0]);
  }

  async getVoucherBalance(): Promise<number> {
    const account: string = await this.getAccount();

    return window.voucher.methods
      .balanceOf(account)
      .call()
      .then((result: number) => {
        const userBalance = this.eRCToDappAmount(result);
        this.setState({
          userBalance
        });
      });
  }

  async checkCanUnwrap(): Promise<number> {
    const account: string = await this.getAccount();

    return window.voucher.methods
      .approvedUnwrappers(account)
      .call()
      .then((result: boolean) => {
        console.log('unwrap result:', result);
        this.setState({
          canUnwrap: result
        });
      });
  }

  private eRCToDappAmount(amount: number): number {
    return amount / 10 ** 18;
  }

  private dappToERC20Amount(amount: number) {
    return amount * 10 ** 18;
  }

  async unwrapCoin(amount: number): Promise<any> {
    console.log('balance is:', this.state.userBalance);
    console.log('amount is:', amount);

    if (amount <= 0) {
      swal('Error', 'Amount must be more than zero', 'error');
      return;
    }

    if (!this.state.canUnwrap) {
      swal('Error', 'Not Permitted to Unwrap', 'error');
      return;
    }

    if (this.state.userBalance < amount) {
      swal('Error', 'Not enough balance', 'error');
    } else {
      let ERC20amount = this.dappToERC20Amount(amount);

      this.setState({ isUnwrapping: true });
      return window.voucher.methods
        .unwrapTokens(ERC20amount.toString())
        .send({ from: await this.getAccount() })
        .on('confirmation', (confirmationNumber: number) => {
          if (confirmationNumber === 1) {
            this.setState({
              isUnwrapping: false,
              isUnwrapped: true
            });
            this.getVoucherBalance();
          }
        })
        .on('error', (error: any) => {
          swal('Error', error, 'error');
        });
    }
  }

  handleClick() {
    this.unwrapCoin(Number(this.state.unwrapAmount));
  }

  render() {
    const { unwrapAmount, isUnwrapping, isUnwrapped } = this.state;

    const shouldPulse = isUnwrapping;
    return (
      <div className={styles.formContainer}>
        <div style={{ color: 'black' }}>
          <Section>
            <div>
              You can unwrap up to
              <h1
                style={{
                  fontWeight: 'bold',
                  marginLeft: '8px',
                  marginRight: '8px'
                }}
              >
                {' '}
                {this.state.userBalance} Dai{' '}
              </h1>
            </div>
          </Section>
        </div>
        <Input
          label="Amount to Unwrap"
          value={unwrapAmount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            this.setState({
              isUnwrapping: false,
              unwrapAmount: e.target.value
            });
          }}
        />

        <div className={styles.bottomSection}>
          <Popup
            disabled={isUnwrapping}
            position="right center"
            trigger={
              <div
                className={`${styles.iconContainer} ${shouldPulse &&
                  styles.pulse}`}
                onClick={() => this.handleClick()}
              >
                <Icon
                  name={
                    isUnwrapping
                      ? 'spinner'
                      : 'arrow alternate circle down outline'
                  }
                  loading={isUnwrapping}
                  size="big"
                  color={isUnwrapped ? 'green' : 'grey'}
                  style={{ marginRight: '0px' }}
                />
              </div>
            }
            content={`Unwrap ${unwrapAmount} Dai`}
          />
        </div>
      </div>
    );
  }
}

export default _Form;
