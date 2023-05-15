import { spawnSync } from "child_process";

const DEBUG = Boolean(JSON.parse(process.env.DEBUG ?? "false"));
const REFRESH = Boolean(JSON.parse(process.env.REFRESH ?? "true"));

const terminalOptions = {
  shell: true,
  detached: false,
  stdio: "inherit",
};

const command = `nodemon ${
  DEBUG ? "--inspect" : ""
} --watch './src/**/*.ts' --exec 'node --loader ts-node/esm' ./src/application.bootstrap.ts`;

if (REFRESH) {
  spawnSync("pnpm mikro-orm:cli migration:fresh", terminalOptions);
  spawnSync("pnpm mikro-orm:cli seeder:run", terminalOptions);
}

spawnSync(command, terminalOptions);
