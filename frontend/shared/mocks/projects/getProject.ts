import { faker } from "@faker-js/faker"
import {
  Address,
  Monetary,
  Project,
  ProjectDTO,
  ProjectMapper,
  UniqueId,
} from "@modernfinops/shared"

export function mockGetProject(projectId: string): ProjectDTO {
  const project = Project.create(
    {
      name: faker.company.name(),
      estimatedIncome: Monetary.create(
        faker.number.int({ min: 10000, max: 100000 })
      ),
      address: Address.create({
        city: faker.location.city(),
        line1: faker.location.streetAddress(false),
        state: faker.location.state(),
        zip: faker.location.zipCode(),
      }),
      clientCompanyId: UniqueId.create("test-client-company-1"),
      estimatedCost: Monetary.create(
        faker.number.int({ min: 10000, max: 100000 })
      ),
    },
    UniqueId.create(projectId)
  )

  return ProjectMapper.toDTO(project)
}
