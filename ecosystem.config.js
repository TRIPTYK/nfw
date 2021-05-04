module.exports = {
    apps: [
        {
            name: "NFW",
            script: "./dist/src/app.bootstrap.js",
            args: "",
            exec_mode: "fork",
            autorestart: false,
            max_restarts: 10,
            restart_delay: 1,
            node_args: "--max-old-space-size=512",
            watch: false,
            max_memory_restart: "500M",
            env: {
                NODE_ENV: "development"
            },
            env_staging: {
                NODE_ENV: "staging"
            },
            env_production: {
                NODE_ENV: "production"
            }
        },
        {
            name: "NFW-DEV",
            script: "./src/app.bootstrap.ts",
            args: "",
            exec_mode: "fork",
            max_restarts: 10,
            env: {
                NODE_ENV: "development"
            },
            env_staging: {
                NODE_ENV: "staging"
            },
            env_production: {
                NODE_ENV: "production"
            }
        }
    ],
    deploy: {
        production: {
            user: "nodejs",
            host: "localhost",
            ssh_options: ["PasswordAuthentication=no"],
            ref: "origin/uniting",
            repo: "git@github:TRIPTYK/nfw.git",
            path: "/var/www/nfw",
            "post-setup": "npm run setup",
            "post-deploy": "npm run deploy production"
        }
    }
};
