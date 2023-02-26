const { network } = require("hardhat");
const {developmentChains,DECIMALS,INITIAL_ANSWER} = require("../helper-hardhat-config.js")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

    if(developmentChains.includes(network.name)){
        log("Local network detected. Deploying Mocks")
        const MockV3Aggregator = await deploy("MockV3Aggregator", {
            from: deployer,
            args: [DECIMALS,INITIAL_ANSWER], //args for constructor
            log: true,
        }); 
        log("Mocks Deployed")
        log("_________________________________________________")
    }
}

module.exports.tags = ["all","mocks"]