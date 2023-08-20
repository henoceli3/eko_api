import dotenv from "dotenv";
import Web3 from "web3";
dotenv.config();

const sepoliaURL =
  "https://eth-sepolia.g.alchemy.com/v2/t9txqScrtnAigbldb87NGz2ZwN-ReBF9";

// Create an instance of Web3 with the Sepolia URL as the provider
const web3 = new Web3(sepoliaURL);

/**
 * Envoie de crypto-monnaie sur Sepolia.
 *
 * @param {Object} req - l'objet de requête
 * @param {Object} res - l'objet de réponse
 * @return {Promise<void>} - une promesse qui ne renvoie rien
 */

const sendCryptoOnSepolia = async (req, res) => {
  try {
    // Extract required data from the request body
    const {
      sender_address,
      destination_address,
      private_key,
      amount,
      gasPriceGwei,
    } = req.body;

    // Convert gas price from Gwei to Wei
    const gasPriceWei = web3.utils.toWei(gasPriceGwei, "gwei");

    // Create the transaction object
    const transactionObject = {
      from: sender_address,
      to: destination_address,
      value: web3.utils.toWei(amount, "ether"),
      gas: "21000",
      gasPrice: gasPriceWei.toString(), // Specify the gas price in Wei
    };

    // Get the estimated gas value for the transaction
    const estimatedGas = await web3.eth.estimateGas(transactionObject);

    // Add the gas field to the transaction object
    transactionObject.gas = estimatedGas;

    // Sign the transaction with the account's private key
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionObject,
      private_key
    );

    // Send the signed transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );

    console.log(`Transaction sent: ${receipt.transactionHash}`);
    const message = `Transaction reussie`;
    res.status(200).json({ message, data: receipt.transactionHash });
  } catch (error) {
    const message = `Une erreur c'est produite: ${error}`; // Error message
    console.log(error);
    res.status(500).json({ message: message });
  }
};

export default sendCryptoOnSepolia;
