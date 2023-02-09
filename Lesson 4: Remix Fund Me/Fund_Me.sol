//Get Funds from Users
//Withdraw Funds
//Set Minimum Funding Values in USD

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "./Price_Convertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    uint256 public constant minimumUSD = 50 * 1e18;

    address[] public funders; 
    mapping(address => uint256) public addressToAmountFunder;

    address public owner;


    constructor(){
        owner = msg.sender;
    }

    //function to send money
    function fund() public payable{
        require(msg.value.getConversionRate()>= minimumUSD, "Didn't Send Enough");
        funders.push(msg.sender);
        addressToAmountFunder[msg.sender] = msg.value;
    }

    

    function withdraw() public onlyOwner{
        

        for(uint256 funderIndex = 0; funderIndex <funders.length; funderIndex++){
            address funder = funders[funderIndex];
            addressToAmountFunder[funder] = 0;

        }

        funders = new address[] (0);

        //msg.sender -> address
        //payable(msg.sender) -> payable address
        // payable(msg.sender).transfer(address(this).balance);

        // bool sendSuccess = payable(msg.sender).send(address(this).balance);
        // require(sendSuccess, "Send Failed");

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");    
        require(callSuccess, "Call Failed");

    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not Owner");
        _; // do rest of the code
    }
}