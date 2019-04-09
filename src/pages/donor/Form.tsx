import React from 'react';

import Input from './Input'
import styles from './Form.module.css'
import { Icon } from 'semantic-ui-react';

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
