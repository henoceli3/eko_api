import express from "express";
import createWallet from "./src/routes/v1/wallet/createWallet.js";
import estimateGasPrice from "./src/routes/v1/utils/getEThGasPrice.js";
import sendCryptoOnSepolia from "./tests/testSepeolia.js";
import sendCryptoOnEthereum from "./src/routes/v1/Transation/Ethereum/envoyer.js";
import getSecretPhrase from "./src/routes/v1/wallet/getSecretPhrase.js";
import generateWalletByMnemonic from "./src/routes/v1/wallet/generateWalletByMnemonic.js";
import getBalanceByaddress from "./src/routes/v1/Transation/Ethereum/getBalance_eth.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json("Bienvenue sur EKO Wallet");
});

// ----------------WALLET----------------------------
router.post("/api/v1/createwallet", generateWalletByMnemonic);
router.get("/api/v1/getSecretPhrase", getSecretPhrase);
router.get("/api/v1/createwallet", createWallet);

// ----------------TRANSACTIONS----------------------------
router.post("/api/v1/sendEthereum", sendCryptoOnEthereum);
router.get("/api/v1/getGasPrice", estimateGasPrice);
router.post("/api/v1/testSepolia", sendCryptoOnSepolia);

// -----------SOLDE------------------------
router.post("/api/v1/getBalance/contract/eth", getBalanceByaddress);


export default router;