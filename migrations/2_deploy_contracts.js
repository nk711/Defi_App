const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

module.exports = async function(deployer, network, accounts) {
  await deployer.deploy(DaiToken)
  const daiToken = await DaiToken.deployed()

  await deployer.deploy(DappToken)
  const dappToken = await DappToken.deployed()
  
  await deployer.deploy(TokenFarm, dappToken.address, daiToken.address)
  const tokenFarm = await TokenFarm.deployed()

  // This transfers all tokens to Token Farm (1 million)
  await dappToken.transfer(tokenFarm.address, '1000000000000000000000000')
  // This transfers 100 muck dai tokens to investors
  await daiToken.transfer(accounts[1], '100000000000000000000')
};

