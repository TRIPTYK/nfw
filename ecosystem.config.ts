/* eslint-disable @typescript-eslint/camelcase */
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
export default {
    apps : [{
        name: "NFW",
        script: "./dist/src/app.bootstrap.js",
        args: "",
        exec_mode: "fork",
        autorestart: true,
        max_restarts : 10,
        restart_delay : 1,
        node_args: "--max-old-space-size=512",
        watch: false,
        max_memory_restart: "500M",
        env: {
            NODE_ENV: process.env.NODE_ENV
        },
    }],
    deploy : {
        production : {
            "user" : "nodejs",
            "host" : "localhost",
            "ssh_options" : ["PasswordAuthentication=no"],
            "ref"  : "origin/uniting",
            "repo" : "git@github:TRIPTYK/nfw.git",
            "path" : "/var/www/nfw",
            "post-setup": "npm run setup",
            "post-deploy" : "npm run deploy production"
        }
    }
};
