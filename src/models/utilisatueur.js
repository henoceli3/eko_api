import Sequelize from "sequelize";
export default function (sequelize, DataTypes) {
  return sequelize.define(
    "utilisatueur",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mdp: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      line_state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      resetTken : {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "utilisatueur",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
      ],
    }
  );
}
