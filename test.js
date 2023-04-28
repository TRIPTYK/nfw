import { spawnSync } from "child_process";

const terminalOptions = {
  shell: true,
  detached: false,
  stdio: "inherit",
};

spawnSync("pnpm run test:unit --watch=false", terminalOptions);
spawnSync("pnpm run test:integration --watch=false", terminalOptions);
spawnSync("pnpm run test:e2e --watch=false", terminalOptions);
