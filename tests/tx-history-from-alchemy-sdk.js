import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import { config } from "dotenv";
import ethereumClasse from "../src/routes/v1/Transation/Ethereum/Ethereum_Classe.js";

config();
const { API_KEY, PRIVATE_KEY } = {
  API_KEY: "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6",
  PRIVATE_KEY:
    "0x4e506e2de271f041144f3dfdce3ce0a19ec3117a135234c94b383d1c05e4233a",
};

const settings = {
  apiKey: API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

let wallet = new Wallet(PRIVATE_KEY);

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    "latest"
  );

  let transaction = {
    to: "0x42539dCFC0065c6134F2d8b6E9B55a7A6b9cd9f5",
    value: Utils.parseEther("0.001"),
    gasLimit: "21000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 11155111,
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  console.log("Sent transaction", tx);
}

// main();
ethereumClasse.test();
