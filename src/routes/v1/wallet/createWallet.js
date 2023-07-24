import generateMnemonic from "../../../utils/generateMnemonic.js";
import generateWallets from "../../../utils/generateWallets.js";

const createWallet = async (req, res) => {
  try {
    const mnemonic = await generateMnemonic(); // géneration de la phrase de sauvegarde
    const wallets = generateWallets(mnemonic); //generation des wallets
    res.status(200).json({ mnemonic: mnemonic, wallets: wallets }); // exportation des wallets ainsi que la phrase de sauvegarde en json
  } catch (error) {
    const message = `Une erreur est survenue : ${error}`; // message d'erreur
    console.log(message);
    res.status(500).json({ message: message });
  }
  // app.get("/api/v1/createwallet", async () => {});
};

export default createWallet;
