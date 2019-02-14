/**
 * array of each element to generate with the provided entity
 * @ template : template file name in /cli/generate/template folder
 * @ dest : destination folder
 * @ ext : file extension
 */
const items = [
  { template : 'controller', dest: 'controllers', ext: 'ts' },
  { template : 'repository', dest: 'repositories', ext: 'ts' },
  { template : 'validation', dest: 'validations', ext: 'ts' },
  { template : 'route', dest: 'routes/v1', ext: 'ts' },
  { template : 'test', dest: '../../test', ext: 'js' },
  { template : 'serializer', dest: 'serializers', ext: 'ts' },
  { template : 'middleware', dest: 'middlewares', ext: 'ts' },
];

const questionsParams = [
    {type : 'input' ,name : 'column', message : "What's the new column name ?"},
    {type : 'list' ,name: 'type', message : "What's the column type ?", choices : ['varchar','datetime','int','text','enum']},
    //{type : 'input' ,name :'lenght', message : "What's the data lenght ?"},
    {type : 'input' ,name : 'defaultValue', message : "What's the column default value ?", default: "null"},
  ]

exports.questionsParams = questionsParams;
exports.items = items;
