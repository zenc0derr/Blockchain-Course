//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Simple_Storage.sol";

contract StorageFactory{

    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStrore(uint256 _simpleStorageIndex, uint256 _simpleStorageNumber) public {
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        // Since the array is of type SimpleStorage It directly comes with the ABI
        // if the array was of type address, we need to wrap it in the contract like -> SimpleStrorage(simpleStorageArray[_simpleStorageIndex]);
        simpleStorage.store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns(uint256){
        SimpleStorage simpleStorage = simpleStorageArray[_simpleStorageIndex];
        return(simpleStorage.retreive());
    }
}