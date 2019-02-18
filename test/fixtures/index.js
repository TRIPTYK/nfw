const uuid = require('uuid/v4');

const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const roles = ['admin', 'user', 'ghost'];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

exports.password = () => {
  return (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toLowerCase();
};

exports.user = (role, pwd) => {
  return {
    username: uuid().substr(0,32),
    email: uuid().substr(0,32) + '@triptyk.be',
    password: pwd || ( Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16) ).toLowerCase().substr(0,8),
    lastname: shuffle(chars).substr(0,8),
    firstname: shuffle(chars).substr(0,8),
    services: '{}',
    role: role || roles[ Math.floor(Math.random() * 3) + 1 ]
  };
};

exports.randomint = (lenght) => {
  if (!lenght) lenght = 11;
  return Math.floor(Math.random() * lenght);
};

exports.randomvarchar = (lenght) => {
  if (!lenght) lenght = 20;
  return Math.random().toString(36).substr(2 , lenght);
};

exports.randomdate = (lenght) => {
  return new Date(Date.now() + Math.random() * (999*9999*9999));
};

exports.randomdatetime = (lenght) => {
  return new Date(Date.now() + Math.random() * (999*9999*9999));
};
