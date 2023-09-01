import express from "express";
import createWallet from "./src/routes/v1/wallet/createWallet.js";
import sendCryptoOnSepolia from "./tests/testSepeolia.js";
import getSecretPhrase from "./src/routes/v1/wallet/getSecretPhrase.js";
import generateWalletByMnemonic from "./src/routes/v1/wallet/generateWalletByMnemonic.js";
import getBlanceBTCNAtive from "./src/routes/v1/Transation/Bitcoin/getBalance.js";
import ethereumClasse from "./src/routes/v1/Transation/Ethereum/Ethereum_Classe.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Bienvenue sur EKO Wallet");
});

// ------------------------------------------WALLET----------------------------
router.post("/api/v1/createwallet", generateWalletByMnemonic);
router.get("/api/v1/getSecretPhrase", getSecretPhrase);
router.get("/api/v1/createwallet", createWallet);

// -------------------------------------------TRANSACTIONS----------------------------
router.post("/api/v1/sendEthereum", (req, res) => {
  ethereumClasse.sendEthereum(req, res);
});
router.get("/api/v1/getGasPrice", (req, res) => {
  ethereumClasse.getEthereumGasPrice(req, res);
});

router.post("/api/v1/testSepolia", sendCryptoOnSepolia); // TODO supprimer cette ligne après le test

// -------------------------------------------HISTORIQUE---------------------------------------------------
router.post("/api/v1/getHistorique/eth", (req, res) => {
  ethereumClasse.getHistotique(req, res);
});
router.post("/api/v1/getHistorique/eth_native", (req, res) => {
  ethereumClasse.getHistotique(req, res);
});
router.post("/api/v1/getHistorique/btc_native", (req, res) => {
  ethereumClasse.getHistotique(req, res);
});

// ------------------------------------------Balances---------------------------------------------
router.post("/api/v1/getBalance/eth_native", (req, res) => {
  ethereumClasse.getBalance(req, res);
});
router.post("/api/v1/getBalance/eth", (req, res) => {
  ethereumClasse.getContractBalance(req, res);
});
router.post("/api/v1/getBalance/btc_native", getBlanceBTCNAtive);

export default router;
