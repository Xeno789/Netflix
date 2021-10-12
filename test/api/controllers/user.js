let request = require('supertest');
let server = require('../../../app');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const nock = require('nock');
let service = nock('http://localhost:10010/');

describe('controllers', function() {
  describe('user', function(){
    describe('Create User', function(){
      it('Should be able to create an account', async() => {
        request(server).post('/user').send({
          "id": 1,
          "username": "Béla",
          "password": "krumpli"
        }).expect(response => {
          expect(response.status).to.be(200)
          expect(response.body).to.have.property('id')
        })
      })
      it('Shouldnt be able to create an account', async() => {
        request(server).post('/user').send({}).expect(response => {
          expect(response.status).to.be(400);
        })
      })
    })
    describe('User login', function(){
      it("should be mocked", async() =>{
        service.get('/user/login').reply(200,{
          "sessionID":50
        });
        request(server).post('/user/login').send({}).expect(response => {
          expect(response.body.sessionID).to.be.equal(50);
        })
        nock.restore();
      })
      it("shouldn't log me in with wrong username and password", async() =>{
        request(server).post('/user/login').send({
          "username": "Igen",
          "password": "Nem"
          }).expect(response =>{
          expect(response.statusCode).to.be(400);
        })
      });
    })
  })
});
