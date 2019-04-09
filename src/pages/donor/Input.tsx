import React from 'react';
import { Input, Form } from 'semantic-ui-react';

import Section from './Section';
import styles from './Input.module.css';

interface Props {
  label: string;
  value: string | number;
  onChange: any;
}

const _Input = ({ label, ...rest }: Props) => (
  <Section>
    <Form.Field>
      <label>{label}</label>
      <div style={{ height: '8px' }} />
      <div className={styles.inputsContainer}>
        <Input
          className={styles.input}
          label="Dai"
          labelPosition="left"
          placeholder="0.00"
          type="number"
          {...rest}
        />
      </div>
    </Form.Field>
  </Section>
);

export default _Input;
