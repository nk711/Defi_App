const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')
const { assert } = require('chai')
const chaiAsPromised = require('chai-as-promised')

require('chai')
  .use(chaiAsPromised)
  .should()


function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}
contract('TokenFarm', ([owner, investor]) => {
    //write tests in here...
    let daiToken, dappToken, tokenFarm 

    before(async() => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // transfer all Dapp tokens to farm (1million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
        // transfer to investor
        await daiToken.transfer(investor,  tokens('100'), { from: owner} )
    })

    describe('Mock Dai Deployment', async ()=>  {
        it('has a name', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe('Dapp Token Deployment', async ()=>  {
        it('has a name', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('Token Farm deployment', async ()=>  {
        it('has a name', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

})