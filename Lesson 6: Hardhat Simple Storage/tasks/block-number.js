require("@nomicfoundation/hardhat-toolbox");

task("block-number","Prints the current block number").setAction(
    //hre - hardhat runtme environment
    async(taskArgs, hre)=>{
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current Block Number: ${blockNumber}`)
    }
)

module.exports = {}