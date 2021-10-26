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
})