const SafeMath = artifacts.require("SafeMath");
const IERC20 = artifacts.require("IERC20");
const PremintERC20 = artifacts.require("PremintERC20");

const StableVoucher = artifacts.require("StableVoucher");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, IERC20);
  deployer.deploy(IERC20);
  deployer.link(IERC20, PremintERC20);
  deployer.deploy(PremintERC20).then(instance => {
    console.log(instance)
  })


  // deployer.deploy(StableVoucher);
  // deployer.link(IERC20, StableVoucher);
};
