import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import createWallet  from "./src/routes/v1/wallet/createWallet.js";

const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json("Bienvenue sur EKO Wallet");
});

// ici nos routes de la version 1.0.0
createWallet(app);

app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur: http://localhost:${port}`
  )
);

//Exporter l'appli
export default app;
