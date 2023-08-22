import dotenv from "dotenv";
import WalletGenerator from "../../../utils/walletClasse.js";
dotenv.config();

const generateWalletByMnemonic = async (res, req) => {
    try {
        const walletGenerator = new WalletGenerator(
          process.env.ETHEREUM_PROVIDER_URL
        );
        const mnemonic = req.body.mnemonic;
        const wallets = await walletGenerator.generateWallets(mnemonic);
        res.status(200).json(wallets);
    } catch (error) {
        const message = `Une erreur est survenue : ${error}`;
        res.status(500).json({ message });
    }
};

export default generateWalletByMnemonic;
