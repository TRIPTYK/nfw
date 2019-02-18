/**
 * array of each element to generate with the provided entity
 * @ template : template file name in /cli/generate/template folder
 * @ dest : destination folder
 * @ ext : file extension
 */
const items = [
  { template : 'controller', dest: 'controllers', ext: 'ts' },
  { template : 'model', dest: 'models', ext: 'ts' },
  { template : 'repository', dest: 'repositories', ext: 'ts' },
  { template : 'validation', dest: 'validations', ext: 'ts' },
  { template : 'route', dest: 'routes/v1', ext: 'ts' },
  { template : 'test', dest: '../../test', ext: 'js' },
  { template : 'serializer', dest: 'serializers', ext: 'ts' },
  { template : 'middleware', dest: 'middlewares', ext: 'ts' },
];

const questionsParams = [
    {type : 'input' ,name : 'column', message : "What's the new column name ?", validate : ( data) =>{
      if(data === ""){
        return "Name must contains at least one letter";
      }else{
        return true;
      }
    }, filter: (data) =>{
      return data.replace(" ","_");
    }},
    {type : 'list' ,name: 'type', message : "What's the column type ?", choices : ['char','varchar','datetime','date','time','timestamp','year','tinyint','smallint','mediumint','binary','varbinary','int','bigint','float','double','decimal','tinytext','mediumtext','text','enum','json','tinyblob','smallblob','mediumblob','blob','bigblob','binary']},
    {type : 'input' ,name : 'defaultValue', message : "What's the column default value ?", default: "null"},
    {type:'list', name:'constraintValue', message:'CONSTRAINT', default : ' ', choices:['primary','unique','no constraint'], filter : (data) =>{
      if(data === 'primary'){
        return 'PRI'
      }else if ( data === 'unique'){
        return 'UNI'
      }else{
        return '';
      }
    }},
    {type:'confirm', name:'uniqueValue', message:'can be null ?', default : true}
  ]

exports.questionsParams = questionsParams;
exports.items = items;
