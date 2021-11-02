import { app } from "../../../../app"
import request from "supertest"
import { Connection } from "typeorm"
import { connectDatabase } from "../../../../database"
import { AppError } from "../../../../shared/errors/AppError";

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

    expect(response.statusCode).toBe(201)
  })

  it("should not be able to create a new user if user exists", async () => {
    expect(async () => { 
      await request(app).post("/api/v1/users").send({
        name: "any name",
        email: "anyemail@mail.com",
        password: "123456"
      })

      await request(app).post("/api/v1/users").send({
        name: "any name",
        email: "anyemail@mail.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

})