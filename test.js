import { spawnSync } from "child_process";

const terminalOptions = {
  shell: true,
  detached: false,
  stdio: "inherit",
  stderr: "inherit",
};

spawnSync("pnpm run test:unit --watch=false", terminalOptions);
spawnSync("pnpm run test:integration --watch=false", terminalOptions);
spawnSync("pnpm run test:acceptance --watch=false", terminalOptions);
