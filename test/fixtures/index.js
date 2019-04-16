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


exports.randomint = (length) => {
  if (!length) length = 11;
  return Math.floor(Math.random() * length);
};

exports.randomvarchar = exports.randomchar = (length) => {
  if (!length) length = 20;
  return Math.random().toString(36).substr(2 , length);
};

exports.randomdate = exports.randomdatetime = exports.randomtimestamp = (length) => { //tofix
  let d = new Date(Date.now() + Math.random() * (999*9999*9999));
  let date_format_str = d.getFullYear().toString()+"-"+((d.getMonth()+1).toString().length==2?(d.getMonth()+1).toString():"0"+(d.getMonth()+1).toString())+"-"+(d.getDate().toString().length==2?d.getDate().toString():"0"+d.getDate().toString())+" "+(d.getHours().toString().length==2?d.getHours().toString():"0"+d.getHours().toString())+":"+((parseInt(d.getMinutes()/5)*5).toString().length==2?(parseInt(d.getMinutes()/5)*5).toString():"0"+(parseInt(d.getMinutes()/5)*5).toString())+":00";
  return date_format_str;
};

exports.randomtinytext = exports.randomtinyblob =() => {
  var randomCharNumber =Math.floor(Math.random() * 128) + 12 ;
  let text = "";
  for (let i = 0; i < randomCharNumber; i++) {
    var randomIndex  = Math.floor(Math.random() * 52) + 1 ;
    text+= chars[randomIndex]    
  }
  return text;
}
exports.randommediumtext = exports.randomtext = exports.randomlongtext = exports.randomblob =exports.randommediumblob = exports.randomlongblob =() => {
  var randomCharNumber =Math.floor(Math.random() * 1000) + 128 ;
  let text = "";
  for (let i = 0; i < randomCharNumber; i++) {
    var randomIndex  = Math.floor(Math.random() * 52) + 1 ;
    text+= chars[randomIndex]    
  }
  return text;
}

exports.randomtime = () => {
  let date = new Date(Date.now() + Math.random() * (999*9999*9999));
  return date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
}
exports.randomyear = () => {
  return new Date(Date.now() + Math.random() * (999*9999*9999)).getFullYear().toString();
}
exports.randomtinyint = (length) => {
  return Math.floor(Math.random()*length);
}
exports.randomsmallint = (length) => {
  return Math.floor(Math.random()*length);
}
exports.randommediumint = (length) => {
  return Math.floor(Math.random()*length);
}
exports.randombigint = (length) => {
  return Math.floor(Math.random()*length);
}
exports.randomfloat= () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
}
exports.randomdouble = () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
}
exports.randomdecimal = () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
}
exports.randombinary = exports.randomvarbinary = (length) => {
  return Math.floor(Math.random()*length).toString(2);
}
exports.randomjson = () => {
  return '{}';
}
exports.randomenum = (enumArray) => {
  let randomIndex  = Math.floor(Math.random() * enumArray.length);
  return enumArray[randomIndex];
}