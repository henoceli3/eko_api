import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import createWallet  from "./src/routes/v1/wallet/createWallet.js";
import sequelize  from "./src/db/sequelize.js";
import router from "./router.js";
import dotenv from "dotenv";
dotenv.config();

//appelle de express()
const app = express();

// definition du port
const port = process.env.PORT || 4000;

//
app.use(cors());

// pour renvoyer le corps en json
app.use(bodyParser.json());

//connexion a la base de données
sequelize.initDb();


// routes
app.use("/", router);

// au cas ou la route demandée n'existe pas
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

// demarrage du serveur
app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur: http://localhost:${port}`
  )
);

//Exporter l'appli
export default app;
