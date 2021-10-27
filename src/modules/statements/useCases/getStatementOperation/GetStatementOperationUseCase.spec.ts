import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getStatementOperationUseCase: GetStatementOperationUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get Statement", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
  })

  it("should be able to get statement operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test name",
      email: "test@email.com",
      password: "123456"
    })

    const statement = await inMemoryStatementsRepository.create({
      user_id: user.id,
      amount: 1000,
      description: "deposit",
      type: OperationType.DEPOSIT
    })

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id
    })

    expect(response).toHaveProperty("id")
  })

  it("should not be able to get statement if user not exists", async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "12345",
        statement_id: "213143"
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it("should not be able to get statement operation if statement not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "Test name",
        email: "test@email.com",
        password: "123456"
      })
  
  
      await getStatementOperationUseCase.execute({
        user_id: user.id,
        statement_id: "212314"
      })
    }).rejects.toBeInstanceOf(AppError)

  })

})