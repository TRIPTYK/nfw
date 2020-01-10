// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
module.exports = {
  apps : [{
    name: 'SCALDIS-API',
    script: './dist/src/app.bootstrap.js',
    args: 'one two',
    instances: 1,
    autorestart: true,
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
      host : '172.16.20.193',
      ssh_options : ["PasswordAuthentication=no","IdentityFile=/home/amaurydeflorenne/.ssh/amaury"],
      ref  : 'origin/develop',
      repo : 'git@github-scaldis:TRIPTYK/nfw.git',
      path : '/var/www/scaldis',
      'post-setup': 'npm run setup',
      'post-deploy' : 'npm run deploy production'
    }
  }
};
