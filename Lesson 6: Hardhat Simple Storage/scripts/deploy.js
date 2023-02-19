const { ethers, run, network } = require("hardhat");

async function main() {
	//Contract Factory in Hardhat
	const SimpleStorageFactory = await ethers.getContractFactory(
		"SimpleStorage"
	);

	console.log("Deploying Contract....");
	const simpleStorage = await SimpleStorageFactory.deploy();

	//to wait to make sure it get deployed
	await simpleStorage.deployed();
	console.log(`Deplyed Contract to: ${simpleStorage.address}`);

	//check if it is a testnet or mainnet and wait for 4 block confirmations
	if(network.config.chainId==5 && process.env.ETHERSCAN_API_KEY){
		await simpleStorage.deployTransaction.wait(4)
		await verify(simpleStorage.address, [])
	}

	//Interacting with the contracts
	//Getting the favourite Number
	const currentValue = await simpleStorage.retreive();
	console.log(`Current Value is: ${currentValue}`)

	//Updating the current value
	const transactionResponse = await simpleStorage.store(99);
	await transactionResponse.wait(1);
	const UpdatedValue = await simpleStorage.retreive();
	console.log(`Update Value is: ${UpdatedValue}`)

}

async function verify(contractAddress, args) {
	console.log("Verifying Contract....");
	try {
		await run("verify:verify", {
			address: contractAddress,
			constructorArguments: args,
		});
	} catch (e) {
		if (e.message.toLowerCase().includes("already verified")) {
			console.log("Already Verified!");
		} else {
			console.log(e);
		}
	}
}

main()
	.then(() => {
		process.exit(0);
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
