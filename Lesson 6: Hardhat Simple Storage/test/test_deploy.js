const { ethers } = require("hardhat");
const { expect, assert } = require("chai");
describe("SimpleStorage", () => {
	let SimpleStorageFactory, simpleStorage
	beforeEach(async function () {
		SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
		simpleStorage = await SimpleStorageFactory.deploy();
		await simpleStorage.deployed();
	});

	it("Should start with a favourite number of zero", async () => {
		const currentValue = await simpleStorage.retreive();
		const expectedValue = "0";
		//We can either use the expect or assert
		assert.equal(currentValue.toString(), expectedValue);
	});

	it("Should Update",async()=>{
		const newValue = "99"
		const transactionResponse = await simpleStorage.store(newValue);
		await transactionResponse.wait(1)

		const updatedValue =  await simpleStorage.retreive();
		assert.equal(updatedValue.toString(), newValue);

	})

	it("Should append to People",async()=>{
		const favourite_number = "10"
		const name = "Tejesh"
		const transactionResponse = await simpleStorage.addPerson(favourite_number,name);
		await transactionResponse.wait(1)

		const value = simpleStorage.nameToFavouriteNumber("Tejesh")
		console.log(value)
		assert(value.toString(),favourite_number)
	})
});
