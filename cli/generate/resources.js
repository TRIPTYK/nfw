/**
 * array of each element to generate with the provided entity
 * @template : template file name in /cli/generate/template folder
 * @dest : destination folder
 * @ext : file extension
 */
exports.items = [
  { template : 'controller', dest: 'controllers', ext: 'ts' },
  { template : 'repository', dest: 'repositories', ext: 'ts' },
  { template : 'validation', dest: 'validations', ext: 'ts' },
  { template : 'route', dest: 'routes/v1', ext: 'ts' },
  { template : 'test', dest: '../../test', ext: 'js' },
  { template : 'serializer', dest: 'serializers', ext: 'ts' },
  { template : 'middleware', dest: 'middlewares', ext: 'ts' },
  { template : 'model', dest: 'models', ext: 'ts' },
];

exports.questionsParams = [
    {
      type : 'input' ,
      name : 'column',
      message : "What's the new column name ?",
      validate : data => {
        if(data === "")                       return "Name must contains at least one letter";
        else if(data.toLowerCase() === 'id')  return 'id is added by default';
        else                                  return true;
      },
      filter: data => data.replace(" ","_")
    },
    {
      type : 'list',
      name: 'type',
      message : "What's the column type ?",
      choices : ['char','varchar','datetime','date','time','timestamp','year','tinyint','smallint','mediumint','binary','varbinary','int','bigint','float','double','decimal','tinytext','mediumtext','text','enum','json','tinyblob','smallblob','mediumblob','blob','bigblob','binary'],
    },
    {
      type : 'input',
      name : 'defaultValue',
      message : "What's the column default value ?",
      default: "null",
      validate : data => {
        console.log(this);
      }
    },
    {
      type:'list',
      name:'constraintValue',
      message:'CONSTRAINT',
      default : ' ',
      choices: ['primary','unique','foreign key','no constraint'],
      filter : data => {
        if(data === 'primary') return 'PRI';
        else if ( data === 'unique') return 'UNI';
        else return data;
      }
    },
    {
      type:'confirm',
      name:'uniqueValue',
      message:'can be null ?',
      default : true
    }
];

exports.questionRelation = [
  {
    type:'input',
    name:'referencedTable',
    message:'Which table is related to this table ?',
    validate: (data) =>{
      data = data.trim();
      if(data ==null || data ==='' || data == undefined){
        return "you must enter a value";
      }else{
        return true;
      }
    }
  },
  {
    type:'input',
    name:'referencedColumn',
    message:'Which column is the referenced column ?',
    validate : data =>{
     if(data ==null || data === '' || data == undefined) return "you must enter a value";
     else return true;
  }}
];
