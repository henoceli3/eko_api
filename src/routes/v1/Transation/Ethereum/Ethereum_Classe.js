import Web3 from "web3";
import abi from "../../../../utils/ethersc_Abi";
import { Alchemy, Network, Wallet, Utils } from "alchemy-sdk";

class Ethereum_Classe {
  constructor(apikey) {
    this.provider = `https://eth-mainnet.g.alchemy.com/v2/${apikey}`;
    this.web3 = new Web3(provider);
    this.alchemy = new Alchemy({
      apiKey: apikey,
      network: Network.ETH_SEPOLIA, //TODO Change this to the network you want to use
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
        gasPriceWei: gasPriceWei,
        gasPriceGwei: gasPriceGwei,
        gasPriceEthEquivalent: gasPriceEthEquivalent,
      });
    } catch (error) {
      res.status(500).json({ message: `Une erreur est survenue : ${error}` });
    }
  }

  async sendEthereum(req, res) {
    try {
      const { privateKey, destinationAddress, amount } = req.body;
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
        chainId: 11155111, //TODO change this to the network id
      };
      const rawTransaction = await wallet.signTransaction(transaction);
      const tx = await this.alchemy.core.sendTransaction(rawTransaction);
      return res.status(200).json(tx);
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getContractBalance(req, res) {
    try {
      const { tokenContractAddress, userAddress } = req.body;
      if (!tokenContractAddress) {
        return res.status(400).json({
          message: "tokenContractAddress est requit",
        });
      }
      if (!userAddress) {
        return res.status(400).json({
          message: "userAddress est requit",
        });
      }
      const tokenContractABI = abi;

      const tokenContract = new this.web3.eth.Contract(
        tokenContractABI,
        tokenContractAddress
      );

      const balance = await tokenContract.methods.balanceOf(userAddress).call();

      const balanceString = balance.toString();

      return res.status(200).json({ solde: balanceString });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getBalance(req, res) {
    try {
      const { userAddress } = req.body;
      if (!userAddress) {
        return res.status(400).json({
          message: "userAddress est requit",
        });
      }
      const balanceWei = await this.web3.eth.getBalance(userAddress);
      const balanceEther = web3.utils.fromWei(balanceWei, "ether");
      return res.status(200).json({ solde: balanceEther });
    } catch (error) {
      const errorMessage = `Une erreur est survenue : ${error}`;
      return res.status(500).json({ message: errorMessage });
    }
  }

  async getHistotique(req, res) {
    try {
      const { userAddress, tokenContractAddress } = req.body;
      if (!userAddress) {
        return res.status(400).json({
          message: "userAddress est requit",
        });
      }

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

      const historique_from = data_to.transfers.map((transaction) => {
        return {
          from: transaction.from,
          to: transaction.to,
          value: transaction.value,
          asset: transaction.asset,
        };
      });
      const historique_to = data_from.transfers.map((transaction) => {
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

export default Ethereum_Classe;
