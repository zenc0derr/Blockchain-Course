//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


library PriceConvertor{
    function getPrice() internal view returns(uint256){
        //ABI
        //Address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

        AggregatorV3Interface priceFeed =  AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        (,int256 price,,,) = priceFeed.latestRoundData(); // Price of ETH in term of USD;
        return uint256(price);
    }

    function getVersion() internal view returns(uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return(priceFeed.version());
    }
    
    function getConversionRate(uint256 ethAmount) internal view returns(uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmounInUSD = (ethPrice*ethAmount) / 1e8;
        return ethAmounInUSD;
    }
}