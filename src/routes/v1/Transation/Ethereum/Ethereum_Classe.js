import Web3 from "web3";
import abi from "../../../../utils/ethersc_Abi.js";
import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";
import { matchedData } from "express-validator";

class Ethereum_Classe {
  constructor(apikey) {
    this.apikey = apikey;
    this.provider = `https://eth-mainnet.g.alchemy.com/v2/${this.apikey}`;
    this.web3 = new Web3(this.provider);
    this.alchemy = new Alchemy({
      apiKey: this.apikey,
      network: Network.ETH_SEPOLIA, //TODO: Change this to the network you want to use
    });
  }

  async getEthereumGasPrice(req, res) {
    try {
      const gasPriceWei = await this.web3.eth.getGasPrice();
      const gasPriceGwei = this.web3.utils.fromWei(gasPriceWei, "gwei");
      const gasPriceEthEquivalent = this.web3.utils.fromWei(
        gasPriceWei,
        "ether"
      );

      res.status(200).json({
        gasPriceWei: gasPriceWei.toString(),
        gasPriceGwei: gasPriceGwei.toString(),
        gasPriceEthEquivalent: gasPriceEthEquivalent.toString(),
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `Une erreur est survenue : ${error}` });
    }
  }

  async sendEthereum(req, res) {
    try {
      const { privateKey, destinationAddress, amount } = matchedData(req);
      const wallet = new Wallet(privateKey);
      const nonce = await this.alchemy.core.getTransactionCount(
        wallet.address,
        "latest"
      );
      const transaction = {
        to: destinationAddress,
        value: Utils.parseEther(amount),
        gasLimit: "21000",
        maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
        maxFeePerGas: Utils.parseUnits("20", "gwei"),
        nonce: nonce,
        type: 2,
        chainId: 11155111, //TODO: change this to the network id 1
      };
      const rawTransaction = await wallet.signTransaction(transaction);
      const tx = await this.alchemy.core.sendTransaction(rawTransaction);
      return res.status(200).json({ transactionHash: tx.hash });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async sendToken(req, res) {
    try {
      const { privateKey, tokenContractAddress, destinationAddress, amount } =
        matchedData(req);

      const wallet = new Wallet(privateKey);
      const tokenContractABI = abi;
      const tokenContract = new this.web3.eth.Contract(
        tokenContractABI,
        tokenContractAddress
      );
      const senderBalance = await tokenContract.methods
        .balanceOf(wallet.address)
        .call();
      const amountInWei = this.web3.utils.toWei(amount, "ether");

      if (senderBalance < amount) {
        return res.status(400).json({
          message: "Solde insuffisant dans le portefeuille expéditeur.",
        });
      }
      const transferData = tokenContract.methods
        .transfer(destinationAddress, amountInWei)
        .encodeABI();

      const nonce = await this.alchemy.core.getTransactionCount(
        wallet.address,
        "latest"
      );
      const gasPriceHex = this.web3.utils.toHex("21000");
      const latestBlock = await this.web3.eth.getBlock("latest");
      const maxGasLimit = latestBlock.gasLimit;

      const gasLimit = Math.min(parseInt(maxGasLimit), 60000);
      const transaction = {
        nonce: nonce,
        from: wallet.address,
        to: tokenContractAddress,
        gasPrice: gasPriceHex,
        gasLimit: this.web3.utils.toHex(gasLimit),
        data: transferData,
        chainId: 11155111, //TODO: Change this to the correct network ID
      };

      const signedTransaction = await wallet.signTransaction(transaction);
      const tx = await this.alchemy.core.sendTransaction(signedTransaction);

      return res.status(200).json({ transactionHash: tx.hash });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getContractBalance(req, res) {
    try {
      const { tokenContractAddress, userAddress } = matchedData(req);

      const response = await this.alchemy.core.getTokenBalances(userAddress, [
        tokenContractAddress,
      ]);

      const balanceString = response.tokenBalances.map((token) =>
        Utils.formatUnits(token.tokenBalance, "ether")
      );

      return res.status(200).json({ solde: balanceString[0] });
    } catch (error) {
      console.log(error);
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getBalance(req, res) {
    try {
      const { userAddress } = matchedData(req);
      const balanceHex = await this.alchemy.core.getBalance(userAddress);
      const balanceEther = Utils.formatUnits(balanceHex, "ether");
      return res.status(200).json({ solde: balanceEther });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getAllBalances(req, res) {
    try {
      const {userAddress, tokenTable} = matchedData(req);
      const balancesTable = tokenTable.map(async (token) => {
        if (token.chainId === "eth_native") {
          const balanceHex = await this.alchemy.core.getBalance(
            userAddress.eth
          );
          const balanceEther = Utils.formatUnits(balanceHex, "ether");
          return balanceEther;
        } else if (token.chainId === "eth") {
          const balanceHex = await this.alchemy.core.getTokenBalances(
            userAddress.eth,
            [token.address_contract]
          );
          const balanceEther = balanceHex.tokenBalances.map((token) =>
            Utils.formatUnits(token.tokenBalance, "ether")
          );
          return balanceEther[0];
        } else {
          return "0";
        }
      });
      const balances = await Promise.all(balancesTable);
      return res.status(200).json({ solde: balances});
    } catch (error) {
      const message = `Une erreur est survenue: ${error}`;
      console.log(error);
      res.status(500).json({ message });
    }
  }

  async getHistorique(req, res) {
    try {
      const { userAddress, asset } = matchedData(req);
      const data_from = await this.alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: userAddress,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
      });
      const data_to = await this.alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: userAddress,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
      });

      const historique_from = data_to.transfers
        .filter((transaction) => transaction.asset === asset)
        .map((transaction) => {
          return {
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            asset: transaction.asset,
          };
        });
      const historique_to = data_from.transfers
        .filter((transaction) => transaction.asset === asset)
        .map((transaction) => {
          return {
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            asset: transaction.asset,
          };
        });

      const historique = historique_from.concat(historique_to);

      res.status(200).json(historique);
    } catch (error) {
      const message = `Une erreur est survenue: ${error}`;
      res.status(500).json({ message });
    }
  }
}
const apiKey = "6mn2xblL6xvsbFUylnJGBkiaypKd4yl6";
const ethereumClasse = new Ethereum_Classe(apiKey);

export default ethereumClasse;
