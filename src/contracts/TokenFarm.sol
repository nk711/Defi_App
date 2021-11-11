pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;

    
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    //constructor function
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
    }

    // Staking tokens (deposit)
    function stakeTokens(uint _amount) public {
        // Code goes inside here....

        //transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        //updates stacking balance
        stakingBalance[msg.sender] = stakingBlance[msg.sender]+_amount;
        //Add users to stakers array only if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        //Update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking tokens (withdraw)

    // Issuing Tokens
}