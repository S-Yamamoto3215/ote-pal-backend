import express from "express";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import yaml from "js-yaml";

export const setSwagger = (app: express.Express) => {
  const swaggerDocument = yaml.load(
    fs.readFileSync("./src/application/config/swagger/swagger.yaml", "utf8")
  );
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument as JSON)
  );
};
