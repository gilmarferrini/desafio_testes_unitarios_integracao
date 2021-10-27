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

  it ("should be able to create a new statement", async () => {
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

})