import express from "express";
import getBlanceBTCNAtive from "./src/routes/v1/Transation/Bitcoin/getBalance.js";
import ethereumClasse from "./src/routes/v1/Transation/Ethereum/Ethereum_Classe.js";
import walletGenerator from "./src/routes/v1/wallet/walletClasse.js";
import global from "./src/routes/v1/globale/globalClasse.js";
import { body, param, validationResult } from "express-validator";
import users from "./src/routes/v2/users/users.js";
import auth from "./src/authentification/auth.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    nom: "Eko wallet",
    versionActuelle: "2.0.0",
    linkV1: "http://localhost:4000/v1/",
    linkV2: "http://localhost:4000/v2/",
  });
});
router.get("/v1/", (req, res) => {
  res.json({ nom: "Eko wallet V1", version: "1.0.0" });
});
router.get("/v2/", (req, res) => {
  res.json({ nom: "Eko wallet V2", version: "2.0.0" });
});
// ------------------------------------------WALLET----------------------------
router.get("/api/v1/getSecretPhrase", (req, res) => {
  walletGenerator.getMnemonic(req, res);
});
router.get("/api/v1/createwallet", (req, res) => {
  walletGenerator.generaleWallet(req, res);
});
router.post(
  "/api/v1/createwallet",
  body("mnemonic").notEmpty().escape(),
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      walletGenerator.generateWalletsFromMnemonic(req, res);
    }
  }
);

// -------------------------------------------TRANSACTIONS----------------------------
// envoyer de l'ethereum pure
router.post(
  "/api/v1/send/eth_native",
  [
    body("privateKey").notEmpty().escape(),
    body("amount").notEmpty().escape(),
    body("destinationAddress").notEmpty().escape(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.sendEthereum(req, res);
    }
  }
);

// envoyer des tokens [ERC20]
router.post(
  "/api/v1/send/eth",
  [
    body("privateKey").notEmpty().escape(),
    body("amount").notEmpty().escape(),
    body("destinationAddress").notEmpty().escape(),
    body("tokenContractAddress").notEmpty().escape(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.sendToken(req, res);
    }
  }
);

// obtenir le prix du gas
router.get("/api/v1/getGasPrice", (req, res) => {
  ethereumClasse.getEthereumGasPrice(req, res);
});

// -------------------------------------------HISTORIQUE---------------------------------------------------
router.post(
  "/api/v1/getHistorique/eth",
  [body("userAddress").notEmpty().escape(), body("asset").notEmpty().escape()],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getHistorique(req, res);
    }
  }
);
router.post(
  "/api/v1/getHistorique/eth_native",
  [body("userAddress").notEmpty().escape(), body("asset").notEmpty().escape()],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getHistorique(req, res);
    }
  }
);
router.post("/api/v1/getHistorique/btc_native", (req, res) => {
  ethereumClasse.getHistorique(req, res);
});

// ------------------------------------------Balances---------------------------------------------
router.post(
  "/api/v1/getBalance/eth_native",
  [body("userAddress").notEmpty().escape()],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getBalance(req, res);
    }
  }
);
router.post(
  "/api/v1/getBalance/eth",
  [
    body("userAddress").notEmpty().escape(),
    body("tokenContractAddress").notEmpty().escape(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      ethereumClasse.getContractBalance(req, res);
    }
  }
);
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
});

// --------------------------------Users--------------------------------
router.post(
  "/api/v2/login/",
  [
    body("email").notEmpty().isEmail().escape(),
    body("mdp").isString().escape(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.login(req, res);
    }
  }
);

router.post(
  "/api/v2/createUser",
  [
    body("nom").notEmpty().isString().escape(),
    body("prenom").notEmpty().isString().escape(),
    body("email").notEmpty().isEmail().escape(),
    body("mdp").isString().escape(),
    // auth,
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.createUser(req, res);
    }
  }
);

router.get(
  "/api/v2/getUserById/:uuid",
  [param("uuid").notEmpty().escape(), auth],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.getUserByUuid(req, res);
    }
  }
);

router.get("/api/v2/getAllUsers/", auth, (req, res) => {
  users.geAlltUsers(req, res);
});

router.post(
  "/api/v2/deletUserByUuid/",
  [
    body("uuid").notEmpty().isString().escape(),
    body("mdp").notEmpty().isString().escape(),
    auth,
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.deleteUserByUuid(req, res);
    }
  }
);

router.post(
  "/api/v2/updateUserNameAndPrenom/",
  [
    body("uuid").notEmpty().isString().escape(),
    body("nom").isString().escape(),
    body("prenom").isString().escape(),
    auth,
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.updateUserNameAndPrenom(req, res);
    }
  }
);

router.post(
  "/api/v2/forgetPassword",
  [
    body("email").notEmpty().isEmail().escape(),
  ],
  (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json(result);
    } else {
      users.forgotPassword(req, res);
    }
  }
);

export default router;
