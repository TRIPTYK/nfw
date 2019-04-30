import * as uuid from "uuid/v4";
import * as dateformat from "dateformat";

const chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const roles = ['admin', 'user', 'ghost'];

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join('');
};

export const password = () => {
  return (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toLowerCase();
};

export const user = (role = null, pwd = "test123*") => {
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


export const randomint = (length) => {
  if (!length) length = 11;
  return Math.floor(Math.random() * length);
};

export const randomvarchar = (length) => {
  if (!length) length = 20;
  return Math.random().toString(36).substr(2 , length);
};
export const randomchar = (length) => {
  return this.randomvarchar(length);
};

export const randomdate = (length) => { //tofix
  let d = new Date(Date.now() + Math.random() * (999*9999*9999));
    return dateformat(d, "dd-mm-yyyy");
};
export const randomdatetime = (length) => { //tofix
  return this.randomdate(length);
};
export const randomtimestamp = (length) => { //tofix
  return this.randomdate(length);
};


export const randomtinytext = () => {
  var randomCharNumber =Math.floor(Math.random() * 128) + 12 ;
  let text = "";
  for (let i = 0; i < randomCharNumber; i++) {
    var randomIndex  = Math.floor(Math.random() * 52) + 1 ;
    text+= chars[randomIndex]    
  }
  return text;
};
export const randomtinyblob = () => {
  return this.randomtinytext()
}
export const randommediumtext = () => {
  var randomCharNumber =Math.floor(Math.random() * 1000) + 128 ;
  let text = "";
  for (let i = 0; i < randomCharNumber; i++) {
    var randomIndex  = Math.floor(Math.random() * 52) + 1 ;
    text+= chars[randomIndex]    
  }
  return text;
};
export const randomtext = () => {
  return this.randommediumtext();
}
export const randomlongtext = () => {
  return this.randommediumtext();
}
export const randomblob = () => {
  return this.randommediumtext();
}
export const randommediumblob = () => {
  return this.randommediumtext();
}
export const randomlongblob = () => {
  return this.randommediumtext();
}
export const randomtime = () => {
  let date = new Date(Date.now() + Math.random() * (999*9999*9999));
  return date.getHours().toString() + ":" + date.getMinutes().toString() + ":" + date.getSeconds().toString();
};

export const randomyear = () => {
  return new Date(Date.now() + Math.random() * (999*9999*9999)).getFullYear().toString();
};

export const randomtinyint = (length) => {
  return Math.floor(Math.random()*length);
};

export const randomsmallint = (length) => {
  return Math.floor(Math.random()*length);
};

export const randommediumint = (length) => {
  return Math.floor(Math.random()*length);
};

export const randombigint = (length) => {
  return Math.floor(Math.random()*length);
};

export const randomfloat = () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
};

export const randomdouble = () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
};

export const randomdecimal = () => {
  return Math.floor(Math.random() * (10000000 - 1000000) + 1000000) / 1000000;
};

export const randombinary = (length) => {
  return Math.floor(Math.random()*length).toString(2);
};
export const randomvarbinary = (length) => {
  return this.randombinary(length);
};

export const randomjson = () => {
  return '{}';
};

export const randomenum = (enumArray) => {
  let randomIndex  = Math.floor(Math.random() * enumArray.length);
  return enumArray[randomIndex];
};