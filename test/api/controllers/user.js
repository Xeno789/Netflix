let request = require('supertest');
let server = require('../../../app');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const nock = require('nock');
let service = nock('http://localhost:3000/');
this.timeout = 5000;
describe('controllers', function() {
  let sessionId;
  let testUsername = "teszt123yz";
  describe('user', function(){
    describe('Create User', function(){
      it('should be able to create an account', async() => {
        await request(server).post('/users').send({
          "username": testUsername,
          "password": "krumpli"
        }).expect(response => {
          expect(response.status).to.be.equal(200)
          expect(response.body).to.have.property('username').to.be.equal(testUsername)
        })
      })
      it('shouldnt be able to create an account', async() => {
        await request(server).post('/users').send({}).expect(response => {
          expect(response.status).to.be.equal(200);
          expect(response.body).to.have.property('error').to.be.equal("no parameters");
        })
      })
    })
    describe('User login', function(){
      it("should log me in with valid username and password", async() =>{
        await request(server).post('/users/login').send({
          "username": testUsername,
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
    describe('Video', function(){
      it("should add video to queue with existing title", async() =>{
        await request(server).post('/queue').set({'Session_key': sessionId}).query({videoTitle: "The Lord of the Rings"}).expect(response =>{
          expect(response.body).to.have.property("message").to.be.equal("Successfully added.");
        })
      })
      it("shouldn't add video to queue with non-existing title", async() =>{
        await request(server).post('/queue').set({'Session_key': sessionId}).query({videoTitle: "The Lordsd of the Rings"}).expect(response =>{
          expect(response.body).to.have.property("error").to.be.equal("Video not found");
        })
      })  
    })
    describe('User logout', function(){
      it("should let me logout with valid sessionId", async() =>{
        await request(server).get('/users/logout')
          .set({'Session_key': sessionId}).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("message").to.be.equal("Successful logout");
        })
      })
      it("shouldn't let me logout with invalid sessionId", async() =>{
        await request(server).get('/users/logout').set({'Session_key': 500}).expect(response =>{
          expect(response.statusCode).to.be.equal(403);
          expect(response.body).to.have.property("message").to.be.equal("Api key missing or not registered");
        })
      })  
    })
    describe('User delete', function(){
      it("should let me delete a user with an existing username", async() =>{
        await request(server).delete('/users/user').set({'X_Admin_API_key': 42}).query({username: testUsername}).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("message").to.be.equal("User deleted");
        })
      })
      it("shouldn't let me delete a user with a non-existing username", async() =>{
        await request(server).delete('/users/user').set({'X_Admin_API_key': 42}).query({username: testUsername}).expect(response =>{
          expect(response.statusCode).to.be.equal(200);
          expect(response.body).to.have.property("error").to.be.equal("User not found");
        })
      })  
    })
  })
});
