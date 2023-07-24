import { Sequelize as _Sequelize } from 'sequelize';
export default function(sequelize, DataTypes) {
  return sequelize.define('portefeuille', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id'
      }
    },
    blockchain_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'blockchain',
        key: 'id'
      }
    },
    public_key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    private_key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: _Sequelize.fn('current_timestamp')
    }
  }, {
    sequelize,
    tableName: 'portefeuille',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
      {
        name: "blockchain_id",
        using: "BTREE",
        fields: [
          { name: "blockchain_id" },
        ]
      },
    ]
  });
};
