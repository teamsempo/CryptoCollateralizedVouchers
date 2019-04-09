// Modern dapp browsers...
import Web3 from "web3";

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        console.log("made it")
        // Request account access if needed
        window.ethereum.enable();
        // Acccounts now exposed
        console.log('mounted new metamask')
    } catch (error) {
        // User denied account access...
        alert("You denied access metamask")
    }
}

// Legacy dapp browsers...
else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
    // Acccounts always exposed
    console.log('mounted old metamask')
} else {
    alert("Please install metamask")
}

export default web3;