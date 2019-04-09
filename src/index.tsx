import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Web3 from "web3";

var deployment = 'kovan';

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

  // Modern dapp browsers...
  if (window.ethereum) {
    window.web3 = new Web3((window as any).ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      console.log('mounted new metamask')
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if ((window as any).web3) {
    window.web3 = new Web3((window as any).web3.currentProvider);
    // Acccounts always exposed
    console.log('mounted old metamask')
  } else {
    alert("Please install metamask")
  }

  let networks: Networks = {
    kovan: {
      coinContractAddr: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
      voucherContractAddr: '0x61c5a0c36239943093e21eb9ba45ee1308df2d86',
      coinDecimals: 18,
      voucherDecimals: 18
    }
  };

  let activeNetwork = networks[deployment];

  ReactDOM.render(<App activeNetwork={activeNetwork}/>, document.getElementById('root'));
});




// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
