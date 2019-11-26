"use strict";

const storedData = databaseStoredData => {
  if (!databaseStoredData) return [];

  const storedDataDto = JSON.parse(JSON.stringify(databaseStoredData));

  delete storedDataDto.encryption_key;
  delete storedDataDto.decryption_key;

  return storedDataDto;
};

module.exports = {
  storedData
};
