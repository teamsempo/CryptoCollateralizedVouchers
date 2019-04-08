import React from 'react';
import {Input} from 'semantic-ui-react'

import styles from './Form.module.css'

const Form = () => {
  return (
  <div className={styles.formContainer}>
    <Input
      label={{
        basic: true,
        content: 'Dai',
        color: 'pink'
      }}
      labelPosition='right'
      placeholder='0.0'
      type="number"
    />
  </div>
)
  };

export default Form;
