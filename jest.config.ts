import dotenv from "dotenv";
import type { Config } from "@jest/types";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

dotenv.config({ path: ".env.test" });

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["**/tests/**/*.test.ts"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
    "!src/**/I*.ts",
    "!src/application/factories/*/*Factory.ts",
    // 以下はE2Eテストでカバーするため除外している
    "!src/main.ts",
    "!src/infrastructure/http/**/*.ts",
    "!src/infrastructure/database/**/*.ts",
  ],
  coverageProvider: "v8",
};

export default config;
