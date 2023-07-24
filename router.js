import express from "express";
import createWallet from "./src/routes/v1/wallet/createWallet.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json("Bienvenue sur EKO Wallet");
})

router.get("/api/v1/createwallet", createWallet);

export default router;