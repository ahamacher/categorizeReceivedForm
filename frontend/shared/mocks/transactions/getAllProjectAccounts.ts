import { faker } from "@faker-js/faker"
import {
  GetAllProjectAccountsResultDTO,
  ProjectAccountDTO,
} from "@modernfinops/shared"

function getFakeProjectAccounts(): ProjectAccountDTO[] {
  const projectAccounts: ProjectAccountDTO[] = []
  for (let i = 0; i < 5; i += 1) {
    const projectAccountDTO: ProjectAccountDTO = {
      id: faker.string.uuid(),
      name: faker.company.name(),
      normalPolarity: "DEBIT",
      accountLedgerCategory: "INCOME",
      clientCompany: {
        id: "test-client-company-1",
        name: "Test Client Company",
        ownerName: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        },
      },
      businessAccount: {
        clientCompanyId: "test-client-company-1",
        codatAccountingAccount: {
          id: faker.string.uuid(),
          nominalCode: faker.string.numeric(),
          name: faker.finance.accountName(),
          description: faker.commerce.department(),
          fullyQualifiedCategory: "Asset.Other Current Asset.Inventory",
          fullyQualifiedName: "",
          currency: "USD",
          currentBalance: faker.number.int({ min: 10000, max: 100000 }),
          type: "Unknown",
          status: "Active",
          isBankAccount: true,
          validDatatypeLinks: [],
          metadata: {
            isDeleted: false,
          },
          modifiedDate: faker.date.recent({ days: 10 }).toISOString(),
          sourceModifiedDate: faker.date.recent({ days: 10 }).toISOString(),
        },
      },
    }
    projectAccounts.push(projectAccountDTO)
  }
  return projectAccounts
}

export const mockGetAllProjectAccountsResponse: GetAllProjectAccountsResultDTO =
  {
    projectAccounts: getFakeProjectAccounts(),
  }
