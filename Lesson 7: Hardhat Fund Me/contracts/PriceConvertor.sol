//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


library PriceConvertor{
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256){
        //ABI
        //Address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

        (,int256 price,,,) = priceFeed.latestRoundData(); // Price of ETH in term of USD;
        return uint256(price);
    }
        
    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256){
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmounInUSD = (ethPrice*ethAmount) / 1e8;
        return ethAmounInUSD;
    }
}