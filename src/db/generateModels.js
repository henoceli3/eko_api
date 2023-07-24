import { SequelizeAuto } from "sequelize-auto";
import dotenv from "dotenv";
dotenv.config();

const auto = new SequelizeAuto("eko", "root", "", {
  host: "localhost",
  dialect: "mysql",
  directory: "../tst-models",
  additional: {
    timestamps: false,
  },
});

auto.run((err) => {
  if (err) {
    throw err;
  }
  console.log(auto.tables); // Affiche les tables de la base de données
  console.log(auto.foreignKeys); // Affiche les clés étrangères de la base de données
});
