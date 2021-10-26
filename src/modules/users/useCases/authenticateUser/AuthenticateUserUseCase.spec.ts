import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {

  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    await createUserUseCase.execute({
      name: "valid name",
      email: "valid_mail@mail.com",
      password: "123456"
    })
  })

  it ("should be able to create a new session with correct values", async () => {
    const authData = await authenticateUserUseCase.execute({
      email: "valid_mail@mail.com",
      password: "123456"
    })

    expect(authData).toHaveProperty("token")
    expect(authData.user).toHaveProperty("id")
  })

  it ("should not be able to create a new session with invalid email", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "invalid@mail.com",
        password: "123456"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it ("should not be able to create a new session with invalid password", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "valid_mail@mail.com",
        password: "8764"
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})