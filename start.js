import { spawnSync } from "child_process";

const DEBUG = process.env.DEBUG ?? false;

const command = `nodemon ${
  DEBUG ? "--inspect" : ""
} --watch './src/**/*.ts' --exec 'node --loader ts-node/esm' ./src/application.bootstrap.ts`;

spawnSync(command, {
  shell: true,
  detached: false,
  stdio: "inherit",
});
