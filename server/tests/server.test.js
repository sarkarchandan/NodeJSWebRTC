const supertest = require("supertest");
const expect = require("expect");
const {server} = require("./../server");

describe("GET /localhost:3000" , () => {

  it("should return 200 OK", (done) => {
    supertest(server)
    .get("/")
    .expect(200)
    .end(done);
  });
  
});