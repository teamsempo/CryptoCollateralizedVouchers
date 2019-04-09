import React from 'react';
import styles from './Section.module.css';

const Section = ({ children }: any) => {
  return <div className={styles.container}>{children}</div>;
};

export default Section;
