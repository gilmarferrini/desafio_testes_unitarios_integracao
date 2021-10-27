import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}


describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
  })

  it("should be able to get balance", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "Test name",
      email: "test@email.com",
      password: "123456"
    })

    await createStatementUseCase.execute({ 
      user_id: user.id, 
      type: OperationType.DEPOSIT,
      amount: 1000,
      description: "deposit" 
    })

    const response = await getBalanceUseCase.execute({
      user_id: user.id,
    })

    expect(response.statement.length).toEqual(1)
  })

  it("should not be able to get balance if user not exists", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({
        user_id: "1234",
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})