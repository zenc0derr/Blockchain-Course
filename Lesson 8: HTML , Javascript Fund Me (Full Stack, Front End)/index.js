import { ethers } from "./ethers.min.js";
import { ABI, CONTRACT_ADDRESS } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
	if (typeof window.ethereum !== "undefined") {
		try {
			await window.ethereum.request({
				method: "eth_requestAccounts",
			});
		} catch (err) {
			console.log(err);
		}
		document.getElementById("connectButton").innerHTML = "Connected";
	} else {
		document.getElementById("connectButton").innerHTML =
			"Please Install Metamask";
	}
}

async function fund() {
	const ethAmount = document.getElementById("ethAmount").value;
	console.log(`Funding With ${ethAmount}...`);
	if (typeof window.ethereum !== "undefined") {
		//provider - connection to the blockchain
		//signer
		//contract we are interacting with
		//ABI and Address
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
		try {
			const transactionResponse = await contract.fund({
				value: ethers.utils.parseEther(ethAmount),
			});
			await listenForTransactionMined(transactionResponse,provider)
			console.log("done")
		} catch (err) {
			console.log(err);
		}
	}
}

async function getBalance(){
	if(typeof window.ethereum !== "undefined"){
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const balance = await provider.getBalance(CONTRACT_ADDRESS)
		console.log(ethers.utils.formatEther(balance))

	}
}

async function withdraw(){
	if(typeof window.ethereum !== "undefined"){
		console.log("Withdrawing....")
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

		try{
			const transactionResponse = await contract.withdraw()
			await listenForTransactionMined(transactionResponse,provider)
			console.log("done")
		}catch(err){
			console.log(err)
		}
	}
}

function listenForTransactionMined(transactionResponse,provider){
	console.log(`Mining ${transactionResponse.hash}...`)
	return new Promise((resolve, reject)=>{
		provider.once(transactionResponse.hash, (transactionReceipt)=>{
			console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
			resolve()
		})
	})
	

}
