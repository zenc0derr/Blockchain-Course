const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");
const { developmentChains } = require("../../helper-hardhat-config.js");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("FundMe", async () => {
			let fundMe;
			let deployer;
			let mockV3Aggregator;
			const sendValue = "1000000000000000000";
			beforeEach(async () => {
				//deploying using hardhat-deploy
				deployer = (await getNamedAccounts()).deployer;
				await deployments.fixture(["all"]);
				fundMe = await ethers.getContract("FundMe", deployer);
				mockV3Aggregator = await ethers.getContract(
					"MockV3Aggregator",
					deployer
				);
			});

			describe("constructor", async () => {
				it("sets the aggregator addresses correctly", async () => {
					const response = await fundMe.priceFeed();
					assert.equal(response, mockV3Aggregator.address);
				});
			});

			describe("fund", async () => {
				it("Fails if you don't send enough ETH", async function () {
					await expect(fundMe.fund()).to.be.revertedWith(
						"Didn't Send Enough"
					);
				});

				it("Updates the amount funded data structure", async () => {
					const x = await fundMe.fund({ value: sendValue });

					const response = await fundMe.addressToAmountFunder(
						deployer
					);
					assert.equal(response.toString(), sendValue.toString());
				});

				it("Updates the fuders address to array", async () => {
					const x = await fundMe.fund({ value: sendValue });

					const response = await fundMe.funders(0);
					assert.equal(deployer.toString(), response.toString());
				});
			});

			describe("withdraw", async () => {
				beforeEach(async () => {
					await fundMe.fund({ value: sendValue });
				});

				it("Withdraw eth from a single funder", async () => {
					//Arrange
					const startingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);
					const startingDeployerBalance =
						await fundMe.provider.getBalance(deployer);
					//Act
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);
					const endingFundMeBalance =
						await fundMe.provider.getBalance(fundMe.address);

					const endingDeployerBalance =
						await fundMe.provider.getBalance(deployer);

					//Assert
					assert.equal(endingFundMeBalance, 0);
					assert.equal(
						startingFundMeBalance
							.add(startingDeployerBalance)
							.toString(),
						endingDeployerBalance.add(gasCost).toString()
					);
				});

				it("Withd   raw eth from a multiple funders", async () => {
					//Arrange
					const accounts = await ethers.getSigners();
					for (let i = 1; i < 6; i++) {
						const fundMeConnectedContract = await fundMe.connect(
							accounts[i]
						);
						await fundMeConnectedContract.fund({
							value: sendValue,
						});
					}

					//Act
					const transactionResponse = await fundMe.withdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					//assert
					//Make sure funders array is reset properly
					await expect(fundMe.funders(0)).to.be.reverted;

					for (i = 1; i < 6; i++) {
						assert.equal(
							await fundMe.addressToAmountFunder(
								accounts[i].address
							),
							0
						);
					}
				});

				it("only allow owner to modify", async () => {
					const accounts = await ethers.getSigners();
					const attacker = accounts[1];
					const attackerConnnectContract = await fundMe.connect(
						attacker
					);
					await expect(attackerConnnectContract.withdraw()).to.be
						.reverted;
				});

				it("Cheaper Withdraw", async () => {
					//Arrange
					const accounts = await ethers.getSigners();
					for (let i = 1; i < 6; i++) {
						const fundMeConnectedContract = await fundMe.connect(
							accounts[i]
						);
						await fundMeConnectedContract.fund({
							value: sendValue,
						});
					}

					//Act
					const transactionResponse = await fundMe.cheaperWithdraw();
					const transactionReceipt = await transactionResponse.wait(
						1
					);
					const { gasUsed, effectiveGasPrice } = transactionReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					//assert
					//Make sure funders array is reset properly
					await expect(fundMe.funders(0)).to.be.reverted;

					for (i = 1; i < 6; i++) {
						assert.equal(
							await fundMe.addressToAmountFunder(
								accounts[i].address
							),
							0
						);
					}
				});
			});
	  });
