import express from "express";
import getBlanceBTCNAtive from "./src/routes/v1/Transation/Bitcoin/getBalance.js";
import ethereumClasse from "./src/routes/v1/Transation/Ethereum/Ethereum_Classe.js";
import walletGenerator from "./src/routes/v1/wallet/walletClasse.js";
import global from "./src/routes/v1/globale/globalClasse.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.json("Bienvenue sur EKO Wallet");
});

// ------------------------------------------WALLET----------------------------
router.get("/api/v1/getSecretPhrase", (req, res) => {
  walletGenerator.getMnemonic(req, res);
});
router.get("/api/v1/createwallet", (req, res) => {
  walletGenerator.generaleWallet(req, res);
});
router.post("/api/v1/createwallet", (req, res) => {
  walletGenerator.generateWalletsFromMnemonic(req, res);
});

// -------------------------------------------TRANSACTIONS----------------------------
router.post("/api/v1/send/eth_native", (req, res) => {
  ethereumClasse.sendEthereum(req, res);
});
router.post("/api/v1/send/eth", (req, res) => {
  ethereumClasse.sendToken(req, res);
});
router.get("/api/v1/getGasPrice", (req, res) => {
  ethereumClasse.getEthereumGasPrice(req, res);
});

// -------------------------------------------HISTORIQUE---------------------------------------------------
router.post("/api/v1/getHistorique/eth", (req, res) => {
  ethereumClasse.getHistorique(req, res);
});
router.post("/api/v1/getHistorique/eth_native", (req, res) => {
  ethereumClasse.getHistorique(req, res);
});
router.post("/api/v1/getHistorique/btc_native", (req, res) => {
  ethereumClasse.getHistorique(req, res);
});

// ------------------------------------------Balances---------------------------------------------
router.post("/api/v1/getBalance/eth_native", (req, res) => {
  ethereumClasse.getBalance(req, res);
});
router.post("/api/v1/getBalance/eth", (req, res) => {
  ethereumClasse.getContractBalance(req, res);
});
router.post("/api/v1/getBalance/btc_native", getBlanceBTCNAtive);

router.post("/api/v1/getAllBalance", (req, res) => {
  ethereumClasse.getAllBalances(req, res);
});

//----------------------------------globale--------------------------------
router.post("/api/v1/getPrice", (req, res) => {
  global.getPriceOfCrypto(req, res);
});

router.get("/api/v1/getNews", (req, res) => {
  global.getNews(req, res);
});


router.get("/api/v1/getTopList", (req, res) => {
  global.getTopList(req, res);
});

router.post("/api/v1/termsUse", (req, res) => {
  global.termsUse(req, res);
})


export default router;