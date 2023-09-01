import express from "express";
import createWallet from "./src/routes/v1/wallet/createWallet.js";
import estimateGasPrice from "./src/routes/v1/utils/getEThGasPrice.js";
import sendCryptoOnSepolia from "./tests/testSepeolia.js";
import sendCryptoOnEthereum from "./src/routes/v1/Transation/Ethereum/envoyer.js";
import getSecretPhrase from "./src/routes/v1/wallet/getSecretPhrase.js";
import generateWalletByMnemonic from "./src/routes/v1/wallet/generateWalletByMnemonic.js";
import getTransactionHistorique_eth from "./src/routes/v1/Transation/Ethereum/getTransactionHistorique_eth.js";
import getBalanceETH from "./src/routes/v1/Transation/Ethereum/getBalance_eth.js";
import getBalanceETHNative from "./src/routes/v1/Transation/Ethereum/getBalance.js";
import getBlanceBTCNAtive from "./src/routes/v1/Transation/Bitcoin/getBalance.js";
import Ethereum_Classe from "./src/routes/v1/Transation/Ethereum/Ethereum_Classe.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Bienvenue sur EKO Wallet");
});

const ethereumClasse = new Ethereum_Classe(process.env.ALCHEMY_API_KEY);

// ----------------WALLET----------------------------
router.post("/api/v1/createwallet", generateWalletByMnemonic);
router.get("/api/v1/getSecretPhrase", getSecretPhrase);
router.get("/api/v1/createwallet", createWallet);

// ----------------TRANSACTIONS----------------------------
router.post("/api/v1/sendEthereum", ethereumClasse.sendEthereum);
router.get("/api/v1/getGasPrice", ethereumClasse.getEthereumGasPrice);
router.post("/api/v1/testSepolia", sendCryptoOnSepolia); // TODO supprimer cette ligne après le test

// ----------------HISTORIQUE----------------------------
router.post("/api/v1/getHistorique/eth", ethereumClasse.getHistotique);
router.post("/api/v1/getHistorique/eth_native", ethereumClasse.getHistotique);
router.post("/api/v1/getHistorique/btc_native", ethereumClasse.getHistotique);

// -----------SOLDE------------------------
router.post("/api/v1/getBalance/eth_native", ethereumClasse.getBalance);
router.post("/api/v1/getBalance/eth", ethereumClasse.getContractBalance);
router.post("/api/v1/getBalance/btc_native", getBlanceBTCNAtive);

export default router;