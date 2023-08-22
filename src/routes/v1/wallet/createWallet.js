import WalletGenerator from "../../../utils/walletClasse.js";
import dotenv from "dotenv";
dotenv.config();


const createWallet = async (req, res) => {
  try {
    const walletGenerator = new WalletGenerator(
      process.env.ETHEREUM_PROVIDER_URL
    );
    const mnemonic = await walletGenerator.generateMnemonic(128);
    const wallets = await walletGenerator.generateWallets(mnemonic);
    res.status(200).json(wallets); // exportation des wallets ainsi que la phrase de sauvegarde en json
  } catch (error) {
    const message = `Une erreur est survenue : ${error}`; // message d'erreur
    res.status(500).json({ message: message });
  }
};
export default createWallet;
