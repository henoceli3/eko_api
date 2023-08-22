import WalletGenerator from "../../../utils/walletClasse.js";
import dotenv from "dotenv";
dotenv.config();


const getSecretPhrase = async (req, res) => {
    try {
        const walletGenerator = new WalletGenerator(
          process.env.ETHEREUM_PROVIDER_URL
        );
        const mnemonic = await walletGenerator.generateMnemonic(128);
        res.status(200).json({ mnemonic });
    } catch (error) {
        const message = `Une erreur est survenue : ${error}`;
        res.status(500).json({ message });
    }
}

export default getSecretPhrase;