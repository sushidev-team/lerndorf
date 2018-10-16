import chaiHttp from 'chai-http';
import chai from 'chai';

import models from '../server/config/sequelize';
import server from '../server/';

chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(server);

describe('Language', () => {
  const language = {
    code: 'lng',
    name: 'language',
  };
  const language1 = {
    code: 'lng1',
    name: 'language1',
  };
  const languages = [];
  const admin = {
    username: 'admin',
    password: 'admin',
  };

  before((done) => {
    models.Language.truncate({
      restartIdentity: true,
      cascade: true,
    });

    done();
  });

  after((done) => {
    server.close();

    done();
  });

  describe('GET /api/languages', () => {
    it('it should GET all the languages', (done) => {
      chai.request(server)
        .get('/api/languages')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);

          done();
        });
    });
  });

  describe('POST /api/languages', () => {
    it('it should not be possible to add a Language when not logged in', (done) => {
      chai.request(server)
        .post('/api/languages')
        .send({})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('error');

          done();
        });
    });

    it('it should display an error when adding a language without required fields', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send({})
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.should.have.property('errors');

              done();
            });
        });
    });

    it('it should display an error when adding a language without code field', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send({
              name: 'language',
            })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.should.have.property('errors');

              done();
            });
        });
    });

    it('it should display an error when adding a language without name field', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send({
              code: 'lng',
            })
            .end((err, res) => {
              res.should.have.status(400);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.should.have.property('errors');

              done();
            });
        });
    });

    it('it should allow a user with the proper permissions to add a new language', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send(language)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('createdAt');
              res.body.should.have.property('updatedAt');

              languages[0] = res.body.id;

              done();
            });
        });
    });

    it('it should not add the same Language twice', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send(language)
            .end((err, res) => {
              res.should.have.status(422);
              res.body.should.be.a('object');
              res.body.should.have.property('error');
              res.body.should.have.property('errors');
              res.body.errors.length.should.be.eql(1);

              done();
            });
        });
    });

    it('it should add a different Language', (done) => {
      agent
        .post('/api/users/login')
        .send(admin)
        .end(() => {
          agent
            .post('/api/languages')
            .send(language1)
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('id');
              res.body.should.have.property('createdAt');
              res.body.should.have.property('updatedAt');

              languages[0] = res.body.id;

              done();
            });
        });
    });
  });

  describe('GET /api/languages/:id', () => {
    it('it should display Language information', (done) => {
      chai.request(server)
        .get(`/api/languages/${languages[0]}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');

          done();
        });
    });
  });

  describe('PATCH /api/languages/:id', () => {
    it('it should allow an empty patch', (done) => {
      agent
        .patch(`/api/languages/${languages[0]}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id');
          res.body.should.have.property('createdAt');
          res.body.should.have.property('updatedAt');

          done();
        });
    });
  });

  describe('DELETE /api/languages/:id', () => {
    it('it should be possible to delete a Language', (done) => {
      chai.request(server)
        .delete(`/api/languages/${languages[0]}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('deleted');

          done();
        });
    });
  });
});
