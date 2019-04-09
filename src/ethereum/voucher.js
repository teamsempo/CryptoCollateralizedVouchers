import VoucherABI from "./ABIs/StableVoucher"
import web3 from "./web3"
import {voucherAddress} from '../constants';

const voucher = new web3.eth.Contract(
    VoucherABI,
    voucherAddress
);

export default voucher;
