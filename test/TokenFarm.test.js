const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')
const { assert, AssertionError } = require('chai')
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

    describe('Farming Tokens', async () => {
        it ('rewards investors for staking mDai tokens', async () => {
            let result 
            //check investor balance before staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), "investor Mock DAI wallet balance correct before staking")

            await daiToken.approve(tokenFarm.address, tokens('100'), {from:investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor })

            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')

            
            // Issue Tokens
            await tokenFarm.issueTokens({ from: owner })

            // Check balances after issuance
            result = await dappToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor DApp Token wallet balance correct after issuance')

            // ensure that only the owner can issue tokens
            await tokenFarm.issueTokens({ from: investor}).should.be.rejected;

            //unstake tokens
            await tokenFarm.unstakeTokens({ from: investor })
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('0'), 'Token Farm Mock DAI balance correct after staking')

            result = await tokenFarm.balanceOf(investor)
            assert.equal(result.toString(), tokens('0'), 'investor staking balance correct after staking')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'false', 'investor staking status correct after staking')


            
        })
    })

})