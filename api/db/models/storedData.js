"use strict";

const { encrypt, decrypt } = require("../../utils/crypto");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    "storedData",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      encryption_key: {
        type: DataTypes.STRING,
        allowNull: false
      },
      value: {
        type: DataTypes.JSON,
        allowNull: false,
        get() {
          const decryption_key = this.getDataValue("encryption_key");
          const value = this.getDataValue("value");
          const decrypted = decrypt(value, decryption_key);
          return JSON.parse(decrypted);
        },
        set(val) {
          const encryption_key = this.getDataValue("encryption_key");
          const value = encrypt(JSON.stringify(val), encryption_key);
          return this.setDataValue("value", value);
        }
      }
    },
    {
      tableName: "storedData",
      freezeTableName: true,
      timestamps: false
    }
  );
};
