import { spawnSync } from "child_process";

const terminalOptions = {
  shell: true,
  detached: false,
  stdio: "inherit",
  stderr: "inherit",
};

function spawnOrFail(command) {
  const result = spawnSync(command, terminalOptions);
  if (result.status !== 0) {
    process.exit(result.status);
  }
}

spawnOrFail("pnpm run test:unit --watch=false");
spawnOrFail("pnpm run test:integration --watch=false");
spawnOrFail("pnpm run test:acceptance --watch=false");
