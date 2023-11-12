import { spawnSync } from "child_process";

const DEBUG = Boolean(JSON.parse(process.env.DEBUG ?? "false"));
const REFRESH = Boolean(JSON.parse(process.env.REFRESH ?? "true"));

const terminalOptions = {
  shell: true,
  detached: false,
  stdio: "inherit",
};

function spawnOrFail(command) {
  const result = spawnSync(command, terminalOptions);
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

const command = `nodemon  ${
  DEBUG ? "--inspect" : ""
} --watch './src/**/*.ts' --exec 'node --loader ts-node/esm' ./src/application.bootstrap.ts`;

if (REFRESH) {
  spawnOrFail("pnpm mikro-orm:cli migration:fresh");
  spawnOrFail("pnpm mikro-orm:cli seeder:run");
}

spawnOrFail(command);
