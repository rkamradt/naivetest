var chakram = require('chakram')
var expect = chakram.expect
describe("User API", () => {
  before(() => {
    var response = chakram.get("http://naivecoin:3001") // make sure naivecoin is up before running
    expect(response).to.have.status(404)
  })
  describe("initial state", () => {
    it("should start with empty user set", () => {
        var response = chakram.get("http://naiveuser:3000/users")
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json([])
        return chakram.wait()
    })
    it("should be able to create a new user", () => {
        var response = chakram.post('http://naiveuser:3000/users',{
            username: 'username',
            fullname: 'Full Name',
            email: 'user@name.com',
            password: 'password'
          })
        expect(response).to.have.status(201)
        expect(response).to.comprise.of.json('hash',null)
        expect(response).to.comprise.of.json('accounts',[])
        expect(response).to.comprise.of.json('username','username')
        expect(response).to.comprise.of.json('fullname','Full Name')
        expect(response).to.comprise.of.json('email','user@name.com')
        return chakram.wait()
    })
    it("should return 403 if a user is searched for without password header", () => {
        var response = chakram.get("http://naiveuser:3000/users/johndoe")
        expect(response).to.have.status(403)
        expect(response).to.comprise.of.json('password header required')
        return chakram.wait()
    })
    it("should return 404 if a non-existent user is searched for with a password header", () => {
        var response = chakram.get("http://naiveuser:3000/users/johndoe", {
          headers: {
            'password': 'password1'
          }
        })
        expect(response).to.have.status(404)
        return chakram.wait()
    })
  })
  describe("with one user", () => {
    before(() => {
      var response = chakram.post('http://naiveuser:3000/users',{
          username: 'username1',
          fullname: 'Full Name1',
          email: 'user@name1.com',
          password: 'password1'
        })
      expect(response).to.have.status(201)
    })
    it("should have at least one user", () => {
        var response = chakram.get("http://naiveuser:3000/users")
        expect(response).to.have.status(200)
        return chakram.wait()
    })
    it("should have user user1", () => {
        var response = chakram.get("http://naiveuser:3000/users/username1", {
          headers: {
            'password': 'password1'
          }
        })
        expect(response).to.have.status(200)
        expect(response).to.comprise.of.json('username','username1')
        return chakram.wait()
    })
    it("should return 403 if wrong password", () => {
        var response = chakram.get("http://naiveuser:3000/users/username1", {
          headers: {
            'password': 'password'
          }
        })
        expect(response).to.have.status(403)
        return chakram.wait()
    })
  })
})
