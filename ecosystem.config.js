// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps : [{
    name: 'NFW-API',
    script: './dist/src/app.bootstrap.js',
    args: '',
    exec_mode: "fork",
    autorestart: true,
    max_restarts : 10,
    restart_delay : 1,
    node_args: "--max-old-space-size=512",
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
  deploy : {
    production : {
      user : 'nodejs',
      host : '<ip>',
      ssh_options : ["PasswordAuthentication=no","IdentityFile=<SSH_KEY>"],
      ref  : 'origin/develop',
      repo : 'git@github:TRIPTYK/nfw.git',
      path : '/var/www/nfw',
      'post-setup': 'npm run setup',
      'post-deploy' : 'npm run deploy production'
    }
  }
};
