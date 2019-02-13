/**
 * array of each element to generate with the provided entity
 * @ template : template file name in /cli/generate/template folder
 * @ dest : destination folder
 * @ ext : file extension
 */
const items = [
  /*
  { template : 'model', dest: 'models', ext: 'ts' },
  */
  { template : 'controller', dest: 'controllers', ext: 'ts' },
  { template : 'repository', dest: 'repositories', ext: 'ts' },
  { template : 'validation', dest: 'validations', ext: 'ts' },
  { template : 'route', dest: 'routes/v1', ext: 'ts' },
  { template : 'test', dest: '../../test', ext: 'js' },
  { template : 'serializer', dest: 'serializers', ext: 'ts' },
  { template : 'middleware', dest: 'middlewares', ext: 'ts' },
];

exports.items = items;
