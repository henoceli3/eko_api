import { DataTypes } from "sequelize";
import _blockchain from "./blockchain.js";
import _portefeuille from "./portefeuille.js";
import _utilisateur from "./utilisateur.js";

function initModels(sequelize) {
  const blockchain = _blockchain(sequelize, DataTypes);
  const portefeuille = _portefeuille(sequelize, DataTypes);
  const utilisateur = _utilisateur(sequelize, DataTypes);

  portefeuille.belongsTo(blockchain, {
    as: "blockchain",
    foreignKey: "blockchain_id",
  });
  blockchain.hasMany(portefeuille, {
    as: "portefeuilles",
    foreignKey: "blockchain_id",
  });
  portefeuille.belongsTo(utilisateur, { as: "user", foreignKey: "user_id" });
  utilisateur.hasMany(portefeuille, {
    as: "portefeuilles",
    foreignKey: "user_id",
  });

  return {
    blockchain,
    portefeuille,
    utilisateur,
  };
}
export default initModels;
