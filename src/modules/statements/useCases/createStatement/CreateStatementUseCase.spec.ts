import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to create a new statement", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test name",
      email: "test@email.com",
      password: "123456"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 1000,
      type: OperationType.DEPOSIT,
      description: "Deposit"
    })

    expect(statement).toHaveProperty("id")
  })


  it ("should not be able to create a new statement if user not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "1234",
        amount: 1000,
        type: OperationType.DEPOSIT,
        description: "Deposit"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should be able to create a new statement with withdraw", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test name",
      email: "test@email.com",
      password: "123456"
    })

    await createStatementUseCase.execute({
      user_id: user.id,
      amount: 2000,
      type: OperationType.DEPOSIT,
      description: "Deposit"
    })

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      amount: 2000,
      type: OperationType.WITHDRAW,
      description: "Deposit"
    })
    

    expect(statement).toHaveProperty("id")
    expect(statement).toHaveProperty("user_id")
  })
})