import React from 'react';
import {Input, Form} from 'semantic-ui-react'

import styles from './Input.module.css'

interface Props  {
  label: string;
  value: string | number;
  onChange: any;
}

const _Input = ({label, ...rest}:Props) => (
  <Form.Field className={styles.container}>
    <label style={{marginBottom: '10px'}}>{label}</label>
    <div className={styles.inputsContainer}>
      <Input
        className={styles.input}
        label='Dai'
        labelPosition='left'
        placeholder='0.00'
        type="number"
        {...rest}
    />
   </div>
  </Form.Field>
);

export default _Input;
