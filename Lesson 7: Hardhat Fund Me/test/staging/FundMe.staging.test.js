const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config.js");

developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", async () => {
			let fundMe;
			let deployer;
			const sendValue = "1000000000000000000";
			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				fundMe = await ethers.getContract("FundMe", deployer);
			});

            it("allows people to fund and withdraw", async()=>{
                await fundMe.fund({value:sendValue})
                await fundMe.withdraw()

                const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address)
                assert.equals(endingFundMeBalance.toString(),"0")
            })
	    });
