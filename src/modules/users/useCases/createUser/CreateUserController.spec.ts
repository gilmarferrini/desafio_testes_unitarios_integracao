import { app } from "../../../../app"
import request from "supertest"
import { Connection } from "typeorm"
import { connectDatabase } from "../../../../database"

let currentConnection: Connection;

describe("Create User Controller", () => {

  beforeAll(async () => {
    currentConnection = await connectDatabase()
    await currentConnection.runMigrations();
  })

  afterAll(async () => {
    await currentConnection.dropDatabase()
    await currentConnection.close()
  })

  it("should be able return status code 201", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "any name",
      email: "anyemail@mail.com",
      password: "123456"
    })

    console.log(response.body)

    expect(response.statusCode).toBe(201)
  })

})