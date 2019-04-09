import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

export interface Network {
  coinContractAddr: string,
  voucherContractAddr: string,
  coinDecimals: number,
  voucherDecimals: number
}

interface Networks {
  [network: string]: Network
}

window.addEventListener('load', async () => {

  // // Modern dapp browsers...
  // if (window.ethereum) {
  //   window.web3 = new Web3((window as any).ethereum);
  //   try {
  //     // Request account access if needed
  //     await window.ethereum.enable();
  //     // Acccounts now exposed
  //     console.log('mounted new metamask')
  //   } catch (error) {
  //     // User denied account access...
  //   }
  // }
  // // Legacy dapp browsers...
  // else if ((window as any).web3) {
  //   window.web3 = new Web3((window as any).web3.currentProvider);
  //   // Acccounts always exposed
  //   console.log('mounted old metamask')
  // } else {
  //   alert("Please install metamask")
  // }

  ReactDOM.render(<App/>, document.getElementById('root'));
});




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
