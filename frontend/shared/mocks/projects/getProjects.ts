import { faker } from "@faker-js/faker"
import { ProjectDTO, GetProjectsQueryResult } from "@modernfinops/shared"
import { mockGetProject } from "./getProject"

function getFakeProjects() {
  const projects: ProjectDTO[] = []
  for (let i = 0; i < 5; i += 1) {
    projects.push(mockGetProject(faker.string.uuid()))
  }
  return projects
}

export const mockGetProjectsResponse: GetProjectsQueryResult = {
  projects: getFakeProjects(),
}
