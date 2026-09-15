import request from "supertest";
import app from "../src/app.js";


describe("API Test",()=>{


test("Health endpoint should work", async()=>{


const response = await request(app)
.get("/api/health");


expect(response.statusCode)
.toBe(200);


expect(response.body.status)
.toBe("OK");


});


});