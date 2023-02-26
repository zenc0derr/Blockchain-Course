//Get Funds from Users
//Withdraw Funds
//Set Minimum Funding Values in USD

// SPDX-License-Identifier: MIT
//Pragma
pragma solidity ^0.8.8;

//Imports
import "./PriceConvertor.sol";

//Error Codes

//Interfaces or Libraries

//Contract

/// @title A contract to receive Funds
/// @author Tejesh Kumar
/// @notice Demo
contract FundMe {

    //Type Declaractions
    using PriceConvertor for uint256;

    //State Variables   
    uint256 public constant minimumUSD = 50 * 1e18;

    address[] public funders; 
    mapping(address => uint256) public addressToAmountFunder;

    address public owner;

    AggregatorV3Interface public priceFeed;

    uint256 public x;

    constructor(address priceFeedAddress){
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    } 

    //function to send money
    function fund() public payable{
        x = msg.value.getConversionRate(priceFeed);
        require(msg.value.getConversionRate(priceFeed)>= minimumUSD, "Didn't Send Enough");
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

    function cheaperWithdraw() public onlyOwner{
        address[] memory funders2 = funders;
        for(uint256 funderIndex = 0; funderIndex <funders2.length; funderIndex++){
            address funder = funders2[funderIndex];
            addressToAmountFunder[funder] = 0;
        }

        funders = new address[] (0);

        (bool callSuccess,) = payable(msg.sender).call{value: address(this).balance}("");    
        require(callSuccess, "Call Failed");
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not Owner");
        _; // do rest of the code
    }
}