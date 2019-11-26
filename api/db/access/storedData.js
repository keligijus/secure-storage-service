"use strict";

module.exports = ({ db, Op }) => {
  const INVALID_INPUT_ERROR = "INVALID_INPUT_ERROR";

  return {
    async store({ id, encryption_key, value }) {
      if (
        id === undefined ||
        encryption_key === undefined ||
        value === undefined
      ) {
        throw new Error(INVALID_INPUT_ERROR);
      }

      const where = { id, encryption_key };
      const existingItem = await db.models.storedData.findOne({
        where,
        raw: true
      });

      if (!existingItem) {
        const item = await db.models.storedData.create({
          id,
          encryption_key,
          value
        });
        return item;
      } else if (existingItem) {
        const item = await db.models.storedData.update(
          { ...existingItem, value },
          { where }
        );
        return item;
      }
    },
    async retrieve({ id, decryption_key }) {
      if (id === undefined || decryption_key === undefined) {
        throw new Error(INVALID_INPUT_ERROR);
      }

      const endsWithWildcard = id.substr(-1) === "*";
      const where = endsWithWildcard
        ? {
            id: {
              [Op.startsWith]: id.slice(0, -1)
            },
            encryption_key: decryption_key
          }
        : { id, encryption_key: decryption_key };
      const items = await db.models.storedData.findAll({ where });
      return items;
    }
  };
};
