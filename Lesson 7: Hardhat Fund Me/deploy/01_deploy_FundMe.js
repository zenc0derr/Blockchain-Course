const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config.js")
const {verify} = require("../utils/verify.js")

module.exports = async ({ getNamedAccounts, deployments }) => {
	const { deploy, log } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress
    if(developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

	//when going for localhost or hardhat we want to use a mock
    //we need to deloy this mock contract too.
	const fundMe = await deploy("FundMe", {
		from: deployer,
		args: [ethUsdPriceFeedAddress], //args for constructor
		log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
	}); 
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        await verify(fundMe.address,[ethUsdPriceFeedAddress])
    }
    log("_____________________________________________")

};

module.exports.tags = ["all","FundMe"]