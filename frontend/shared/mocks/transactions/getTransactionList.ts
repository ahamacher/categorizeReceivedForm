import { faker } from "@faker-js/faker"
import {
  SourceTransaction,
  SourceTransactionDTO,
  SourceTransactionMapper,
  SourceTransactionProps,
  UniqueId,
} from "@modernfinops/shared"

const codatConnectionId = UniqueId.create(faker.string.uuid())
const connectedAccountId = UniqueId.create(faker.string.uuid())

// Currently all transactions being generated will be UNCATEGORIZED
function generateFakeTransactions(
  numberOfTransactions: number
): SourceTransactionDTO[] {
  const fakeTransactions: SourceTransactionDTO[] = []
  for (let i = 0; i < numberOfTransactions; i += 1) {
    const postedDate = faker.date.recent({ days: 10 }).toISOString()
    const transactionProps: SourceTransactionProps = {
      clientCompanyId: UniqueId.create("test-client-company-1"),
      codatConnectionId,
      connectedAccountId,
      isPersisted: false,
      status: "UNCATEGORIZED",
      codatTransaction: {
        id: faker.string.uuid(),
        accountId: codatConnectionId.toString(),
        description: faker.finance.transactionDescription(),
        amount: -parseFloat(faker.finance.amount(100, 1000)),
        currency: "USD",
        postedDate,
        authorizedDate: faker.date
          .recent({ days: 10, refDate: postedDate })
          .toISOString(),
        merchantName: faker.company.name(),
        transactionCategoryRef: {
          id: faker.commerce.department(),
        },
        modifiedDate: postedDate,
        sourceModifiedDate: postedDate,
      },
    }

    const newSourceTransaction = SourceTransaction.create(
      transactionProps,
      transactionProps.codatTransaction.id
    )

    const sourceTransactionDTO = SourceTransactionMapper.toDTO(
      newSourceTransaction.value
    )

    fakeTransactions.push(sourceTransactionDTO)
  }

  return fakeTransactions
}

function generateFakeIncomeTransactions(numberOfTransactions: number) {
  const fakeTransactions: SourceTransactionDTO[] = []
  for (let i = 0; i < numberOfTransactions; i += 1) {
    const postedDate = faker.date.recent({ days: 10 }).toISOString()
    const transactionProps: SourceTransactionProps = {
      clientCompanyId: UniqueId.create("test-client-company-1"),
      codatConnectionId,
      connectedAccountId,
      isPersisted: false,
      status: "UNCATEGORIZED",
      codatTransaction: {
        id: faker.string.uuid(),
        accountId: codatConnectionId.toString(),
        description: `Deposited #${faker.finance.routingNumber()}`,
        amount: parseFloat(faker.finance.amount(500, 1000)),
        currency: "USD",
        postedDate,
        authorizedDate: faker.date
          .recent({ days: 10, refDate: postedDate })
          .toISOString(),
        merchantName: faker.company.name(),
        transactionCategoryRef: {
          id: faker.commerce.department(),
        },
        modifiedDate: postedDate,
        sourceModifiedDate: postedDate,
      },
    }

    const newSourceTransaction = SourceTransaction.create(
      transactionProps,
      transactionProps.codatTransaction.id
    )

    const sourceTransactionDTO = SourceTransactionMapper.toDTO(
      newSourceTransaction.value
    )

    fakeTransactions.push(sourceTransactionDTO)
  }

  return fakeTransactions
}

const sourceTransactions = [
  ...generateFakeTransactions(10),
  ...generateFakeIncomeTransactions(10),
]

export const mockGetTransactionList = {
  sourceTransactions,
}
