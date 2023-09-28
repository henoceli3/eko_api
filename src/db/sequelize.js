import Sequelize from "sequelize";
import initModels from "../models/init-models.js";
import mysql2 from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Connexion à la base de données
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  dialectModule: mysql2,
  dialectOptions: {
    // Options supplémentaires spécifiques au dialecte si nécessaire
  },
  logging: false,
});

// Création des modèles en utilisant la fonction initModels
const models = initModels(sequelize);

// Synchronisation de la base de données
const initDb = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log("Connexion à la base de données réussie et synchronisée");
  } catch (error) {
    console.error("Échec de la connexion à la base de données :", error);
  }
};

export default {
  initDb,
  models,
};
