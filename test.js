import { spawnSync } from "child_process";

const args = process.argv.slice(2);

process.env.NODE_ENV = "test";

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

if (process.env.CI) {
  spawnOrFail("pnpm lint");
}
spawnOrFail("pnpm mikro-orm:cli migration:fresh");
spawnOrFail(`pnpm vitest --watch=false ${args.join("  ")}`);
