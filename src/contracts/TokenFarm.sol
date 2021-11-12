pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "Dapp Token Farm";
    DappToken public dappToken;
    DaiToken public daiToken;

    address[] public stakers;
    address public owner;
    
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;


    //constructor function
    constructor(DappToken _dappToken, DaiToken _daiToken) public {
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    // Staking tokens (deposit)
    function stakeTokens(uint _amount) public {
        require(_amount > 0, 'amount cannot be 0');
        //transfer mock dai tokens to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amount);
        //updates stacking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender]+_amount;
        //Add users to stakers array only if they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        //Update staking status
        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // Unstaking tokens (withdraw)
    function unstakeTokens() public {
        // Fetching staking balance
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, "Stacking balance cannot be 0");
        // Transfer Mock Dai Tokens to this contract for staking
        daiToken.transfer(msg.sender, balance);
        // Reset Staking Balance
        stakingBalance[msg.sender]=0;
        // Update Staking Status
        isStaking[msg.sender] = false;
    }

    
    // Issuing Tokens
    function issueTokens() public {
        require(msg.sender == owner, 'caller must be the owner');
        for (uint i=0; i<stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if (balance >0) {
                dappToken.transfer(recipient, balance);
            }
        }
    }
}