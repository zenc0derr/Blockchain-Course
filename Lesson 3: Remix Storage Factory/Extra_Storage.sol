//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Simple_Storage.sol";

contract ExtraStorage is SimpleStorage{
    function store(uint256 _favouriteNumber) public override{
        favouriteNumber = _favouriteNumber + 5;
    }
}