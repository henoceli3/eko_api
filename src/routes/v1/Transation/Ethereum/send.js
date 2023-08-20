import dotenv from "dotenv";
import Web3 from "web3";
dotenv.config();

const alchemyKey = process.env.ALCHEMY_API_KEY;

// Créez une instance de Web3 avec l'URL Alchemy en tant que fournisseur (provider)
const web3 = new Web3(`https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`);

/**
 * Envoie de la cryptomonnaie sur le réseau Ethereum.
 *
 * @param {Object} req - L'objet de la requête.
 * @param {Object} res - L'objet de la réponse.
 * @param {string} req.sender_address - L'adresse de l'expéditeur.
 * @param {string} req.destination_address - L'adresse du destinataire.
 * @param {string} req.private_key - La clé privée.
 * @param {string} req.amount - Le montant à envoyer.
 * @param {string} req.gasPriceGwei - Le prix du gas en Gwei.
 * @return {Promise<void>} Une promesse qui se résout lorsque la transaction est envoyée avec succès.
 */

const sendCryptoOnEthereum = async (req, res) => {
  try {
    // Extration les données de la requête
    const {
      sender_address, // Adresse de l'envoyeur
      destination_address, // Adresse du destinataire
      private_key, // Clé privée
      amount, // Montant envoyé
      gasPriceGwei, // le prix du gas en Gwei
    } = req.body;

    // Convertir le prix de la transaction en Wei
    const gasPriceWei = web3.utils.toWei(gasPriceGwei, "gwei");

    // Créer l'objet transaction
    const transactionObject = {
      from: sender_address,
      to: destination_address,
      value: web3.utils.toWei(amount, "ether"),
      gas: 0,
      gasPrice: gasPriceWei, // Specify the gas price in Wei
    };

    // Obtenir une estimation du prix de la transaction
    const estimatedGas = await web3.eth.estimateGas(transactionObject);

    // Ajouter le prix de la transaction à l'objet transaction
    transactionObject.gas = estimatedGas;

    // Signer l'objet transaction avec la clé privée
    const signedTransaction = await web3.eth.accounts.signTransaction(
      transactionObject,
      private_key
    );

    // Envoi de la transaction
    const receipt = await web3.eth.sendSignedTransaction(
      signedTransaction.rawTransaction
    );
    const message = `Transaction effectuée avec succès`; // Message de confirmation
    res.status(200).json({ message, data: receipt.transactionHash }); // Exportation du hash de la transaction
  } catch (error) {
    const message = `Une erreur est survenue : ${error}`; // message d'erreur
    res.status(500).json({ message: message }); // Exportation du message d'erreur
  }
};

export default sendCryptoOnEthereum;
