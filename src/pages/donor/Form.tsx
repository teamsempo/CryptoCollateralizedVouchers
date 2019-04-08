import React, { useState } from 'react';

import Input from './Input'
import styles from './Form.module.css'
import { Icon } from 'semantic-ui-react';

const _Form = () => {
  const [approved, setApproved] = useState(false);
  const [convertAmount, setConvertAmount] = useState('');
  return (
    <div className={styles.formContainer}>
      <Input
        label="Amount to convert"
        value={convertAmount}
        onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
          return setConvertAmount(e.target.value);
        }}/>

      <div className={styles.bottomSection}>
        <div className={styles.iconContainer}>
          <Icon name="check circle outline" size="huge" color="grey"/>
        </div>
      </div>
    </div>
  )
};

export default _Form;
