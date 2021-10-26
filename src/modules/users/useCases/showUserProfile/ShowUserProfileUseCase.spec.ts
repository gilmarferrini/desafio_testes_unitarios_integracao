import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Show User Profile", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })


  it ("should be able to find user profile", async () => {
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    const createdUser = await createUserUseCase.execute({
      name: "valid name",
      email: "valid_mail@mail.com",
      password: "123456"
    })

    const response = await showUserProfileUseCase.execute(createdUser.id)

    expect(response).toHaveProperty("id")
    expect(response.name).toEqual("valid name")
  })

  it ("should not be able to find user profile if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("invalid id")
    }).rejects.toBeInstanceOf(AppError)
  })
})