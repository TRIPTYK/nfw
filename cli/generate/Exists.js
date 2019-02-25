const {lowercaseEntity} = require('./utils');
const FS = require('fs');
const Util = require('util')
const Exists = Util.promisify(FS.exists);

const _Exist = async (modelName) =>{
    lowercase = lowercaseEntity(modelName);
    let entityExists = await Exists(`${process.cwd()}/src/api/models/${lowercase}.model.ts`);
    if (entityExists) return true;
    else return false;
}


module.exports = _Exist;