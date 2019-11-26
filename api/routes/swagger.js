module.exports = ({ router }) => {
  if (process.env.NODE_ENV === "development") {
    const swaggerUi = require("swagger-ui-express");
    const YAML = require("yamljs");
    const swaggerDocument = YAML.load("./swagger.yml");
    router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
};
