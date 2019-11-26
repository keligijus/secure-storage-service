"use-strict";

const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const db = require("../index.js");
const makeStoredDataAccess = require("./storedData");

const storedData = makeStoredDataAccess({ db, Op });

module.exports = {
  storedData
};
