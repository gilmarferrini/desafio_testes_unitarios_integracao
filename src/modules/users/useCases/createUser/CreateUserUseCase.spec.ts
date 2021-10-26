import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to create a new user", async () => {
    const createdUser = await createUserUseCase.execute({
      name: "any name",
      email: "any_email@mail.com",
      password: "123456"
    })

    expect(createdUser).toHaveProperty("id")
    expect(createdUser.name).toEqual("any name")
  })

  it("should not be able to create a new user with email exists in database", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "any name 1",
        email: "any_email@mail.com",
        password: "123456"
      })

      await createUserUseCase.execute({
        name: "any name 2",
        email: "any_email@mail.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})