import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Web3 from "web3";
import ERC20ABI from "./ethereum/ABIs/ERC20";
import VoucherABI from "./ethereum/ABIs/StableVoucher";

// contracts
import coin from './ethereum/coin';
import voucher from './ethereum/voucher';

declare global {
  interface Window {
    ethereum: any;
    web3: any;
    coin: any;
    voucher: any;
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
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
    } catch (error) {
      // User denied account access...
    }
  }
  // Legacy dapp browsers...
  else if (window.ethereum.web3) {
    window.web3 = new Web3(window.ethereum.web3.currentProvider);
    // Acccounts always exposed
    console.log('mounted old metamask')
  } else {
    alert("Please install metamask")
  }

  window.coin = coin
  window.voucher = voucher

  ReactDOM.render(<App/>, document.getElementById('root'));
});

