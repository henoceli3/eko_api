import { DataTypes } from "sequelize";
import _portefeuille from "./portefeuille.js";
import _utilisatueur from "./utilisatueur.js";

function initModels(sequelize) {
  var portefeuille = _portefeuille(sequelize, DataTypes);
  var utilisatueur = _utilisatueur(sequelize, DataTypes);


  return {
    portefeuille,
    utilisatueur,
  };
}
export default initModels;