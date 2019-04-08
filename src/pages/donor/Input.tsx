import React from 'react';
import {Input, Form, Icon} from 'semantic-ui-react'

import styles from './Input.module.css'

interface Props  {
  label: string;
  value: string;
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
    <Icon name='arrow alternate circle right outline' circular link style={{marginLeft: '20px' }} />
   </div>
  </Form.Field>
);

export default _Input;
