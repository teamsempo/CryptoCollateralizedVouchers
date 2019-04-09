import VoucherABI from "./ABIs/StableVoucher"
import web3 from "./web3"

const voucher = new web3.eth.Contract(
    VoucherABI,
    '0x61c5a0c36239943093e21eb9ba45ee1308df2d86'
);

export default voucher;
