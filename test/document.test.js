var request = require('supertest');
var uuid = require('uuid/v4');

describe("Document CRUD", function () {
  
  var server, agent, token, uid, id;
  var expect = require('chai').expect;

  before(function (done) {

    let express = require('../dist/app.bootstrap')
    let credentials = {
      username: 'triptyk',
      email: 'steve@triptyk.eu',
      password: 'e2q2mak7'
    };

    server = express.App;
    agent = request.agent(server);

    agent
      .post('/api/v1/auth/login')
      .send(credentials)
      .end(function(err, response){
        expect(response.statusCode).to.equal(200);
        token = response.body.token.accessToken;
        uid = uuid().substr(0,32);
        done();
      });

  });
  
  after(function () {
    server = undefined;
    delete server;
  });

  // Tester l'upload de fichier 
  // Créer un fichier from scratch 
  // Le transmettre à l'API 
  // Vérifier la validation 
  // Vérifier la présence du fichier
  // Comparer la taille

  // Tester le resizing ?
  
  // Tester la présence du fichier sur l'objet req après upload
  // Tester le crud DB

  /*
  it('POST succeed as 201 on /api/v1/documents', function (done) {
    agent
      .post('/api/v1/documents')
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: uid,
        email: uid + '@triptyk.eu',
        password: 'e2q2mak7',
        services: "{}",
        role: "admin",
        firstname: uid.substr(0,8),
        lastname: uid.substr(0,8)
      })
      .end(function(err, res) {
        expect(res.statusCode, 201);
        id = res.body.id;
        done();
      }) 
  });

  it('GET succeed as 200 on /api/v1/documents/n', function (done) {
    agent
      .get('/api/v1/documents/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(200, done);
  });

  it('PUT succeed as 200 on /api/v1/documents/n', function (done) {
    agent
      .put('/api/v1/documents/' + id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: uuid().substr(0,32),
        email: uuid().substr(0,32) + '@triptyk.eu',
        password: 'e2q2mak7',
        services: "{}",
        role: "admin",
        firstname: uuid().substr(0,8),
        lastname: uuid().substr(0,8)
      })
      .expect(200, done);
  });

  it('PATCH succeed as 200 on /api/v1/documents/n', function (done) {
    agent
      .patch('/api/v1/documents/' + id)
      .set('Authorization', 'Bearer ' + token)
      .send({
        username: uuid().substr(0,32),
        lastname: uuid().substr(0,8)
      })
      .expect(200, done);
  });

  it('DELETE succeed as 204 on /api/v1/documents/n', function (done) {
    agent
      .delete('/api/v1/documents/' + id)
      .set('Authorization', 'Bearer ' + token)
      .expect(204, done);
  });
  */

});