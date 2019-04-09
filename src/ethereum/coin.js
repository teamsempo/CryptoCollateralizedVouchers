import ERC20ABI from "./ABIs/ERC20"
import web3 from "./web3"

const coin = web3.eth.Contract(
    ERC20ABI,
    '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'
);

export default coin;

