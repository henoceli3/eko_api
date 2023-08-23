import dotenv from "dotenv";
import WalletGenerator from "../../../utils/walletClasse.js";
dotenv.config();

const generateWalletByMnemonic = async (req, res) => {
  try {
    const mnemonic = req.body.mnemonic;
    const walletGenerator = new WalletGenerator(
      process.env.ETHEREUM_PROVIDER_URL
    );
    if (!mnemonic) {
      res.status(400).json({ message: "Mnemonic is required" });
    }
    const wallets = await walletGenerator.generateWallets(mnemonic);
    res.status(200).json(wallets);
  } catch (error) {
    const message = `Une erreur est survenue : ${error}`;
    res.status(500).json({ message });
  }
};

export default generateWalletByMnemonic;
