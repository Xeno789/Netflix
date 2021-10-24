let request = require('supertest');
let server = require('../../../app');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const nock = require('nock');
let service = nock('http://localhost:10010/');
let sessionId;
describe('controllers', function() {
  describe('user', function(){
    describe('Create User', function(){
      it('Should be able to create an account', async() => {
        await request(server).post('/users').send({
          "username": "Teszt12",
          "password": "krumpli"
        }).expect(response => {
          expect(response.status).to.be.equal(200)
          expect(response.body).to.have.property('username').to.be.equal("Teszt12")
        })
      })
      it('Shouldnt be able to create an account', async() => {
        await request(server).post('/users').send({}).expect(response => {
          expect(response.status).to.be.equal(200);
          expect(response.body).to.have.property('error').to.be.equal("no parameters");
        })
      })
    })
    describe('User login', function(){
      it("should log me in with valid username and password", async() =>{
        await request(server).post('/users/login').send({
          "username": "Béla",
          "password": "krumpli"
          }).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("message").to.be.equal("Successful login");
          sessionId = response.body.session_key;
        })
      });
      it("shouldn't log me in with invalid username and password", async() =>{
        await request(server).post('/users/login').send({
          "username": "nonexistantusername",
          "password": "nonexistantpassword"
          }).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("error").to.be.equal("Invalid username/password");
        })
      });
    })
    describe('User logout', function(){
      it("Should let me logout with valid sessionId", async() =>{
        await request(server).get('/users/logout').set({'Session_key': sessionId}).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("message").to.be.equal("Successful logout");
        })
      })
      it("Shouldn't let me logout with invalid sessionId", async() =>{
        await request(server).get('/users/logout').set({'Session_key': 500}).expect(response =>{
          expect(response.statusCode).to.be.equal(403);
          expect(response.body).to.have.property("message").to.be.equal("Api key missing or not registered");
        })
      })  
    })
/*     describe('Video', function(){
      it("Add video to queue", async() =>{
        await request(server).get('/queue?videoTitle=The%20Lord%20of%20the%20Rings').set({'Session_key': sessionId}).expect(response =>{
          expect(response.body).to.have.property("message").to.be.equal("Successfully added.");
        })
      })  
    }) */
  })
});
