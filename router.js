import express from "express";
import createWallet from "./src/routes/v1/wallet/createWallet.js";
import estimateGasPrice from "./src/routes/v1/utils/getEThGasPrice.js";
import sendCryptoOnSepolia from "./tests/testSepeolia.js";
import sendCryptoOnEthereum from "./src/routes/v1/Transation/Ethereum/envoyer.js";
import getSecretPhrase from "./src/routes/v1/wallet/getSecretPhrase.js";
// import sendBitcoin from "./src/routes/v1/Transation/Bitcoin/send.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json("Bienvenue sur EKO Wallet");
})

router.post("/api/v1/createwallet", createWallet); // creation du wallet by mnemonic
router.get("/api/v1/getSecretPhrase", getSecretPhrase); // phrase de sauvegarde
router.get("/api/v1/createwallet", createWallet); // creation du wallet

router.post("/api/v1/sendEthereum", sendCryptoOnEthereum); // transaction sur ethereum
router.get("/api/v1/getGasPrice", estimateGasPrice); // estimation du prix de transaction pour ethereum
router.post("/api/v1/testSepolia", sendCryptoOnSepolia); // transaction sur sepolia  TODO : a supprimer

// router.post("/api/v1/sendBitcoin", sendBitcoin); 

export default router;