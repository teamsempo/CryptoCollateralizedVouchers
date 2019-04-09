import ERC20ABI from "./ABIs/ERC20"
import web3 from "./web3"
import {coinAddress} from '../constants';

const coin = web3.eth.Contract(
    ERC20ABI,
    coinAddress
);

export default coin;

