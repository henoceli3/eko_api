import generateMnemonic from "../../../utils/generateMnemonic.js";
import generateWallets from "../../../utils/generateWallets.js";

/**
 * Crée un portefeuille en générant une phrase mnémonique et les portefeuilles associés.
 *
 * @param {Object} req - L'objet de requête.
 * @param {Object} res - L'objet de réponse.
 * @return {Promise} Une promesse qui se résout à la phrase mnémonique générée et aux portefeuilles.
 */

const createWallet = async (req, res) => {
  try {
    const mnemonic = await generateMnemonic(); // géneration de la phrase de sauvegarde
    const wallets = generateWallets(mnemonic); //generation des wallets
    console.log({mnemonic, wallets});
    res.status(200).json({ mnemonic: mnemonic, wallets: wallets }); // exportation des wallets ainsi que la phrase de sauvegarde en json
  } catch (error) {
    const message = `Une erreur est survenue : ${error}`; // message d'erreur
    res.status(500).json({ message: message });
  }
};
export default createWallet;
