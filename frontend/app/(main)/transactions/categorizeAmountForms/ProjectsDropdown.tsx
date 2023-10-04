import { Project } from "@modernfinops/shared"
import { SxProps } from "@mui/system"
import { Autocomplete } from "@ui/common/Inputs"

interface ProjectsDropdownProps {
  projects: Project[]
  fieldName: string
  sx?: SxProps
}

function ProjectsDropdown({
  projects,
  fieldName,
  ...props
}: ProjectsDropdownProps) {
  const projectOptions = projects.map((project) => ({
    label: project.displayName,
    id: project.id.toString(),
  }))
  return (
    <Autocomplete
      fieldName={fieldName}
      label="Project"
      options={projectOptions}
      data-testid="projectsDropdown"
      {...props}
    />
  )
}
export default ProjectsDropdown
