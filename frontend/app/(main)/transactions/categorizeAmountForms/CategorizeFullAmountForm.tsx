import {
  CategorizeAmountReceivedForProjectDTO,
  CategorizeAmountSpentForProjectDTO,
  SourceTransactionMapper,
} from '@modernfinops/shared'
import { Box, Button, TextField } from '@ui/common'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { FAKE_PROJECTS } from '../FAKE_DATA'
import {
  categorizeAmountReceivedForProject,
  categorizeAmountSpentForProject,
} from '../commands'
import ProjectAccountsDropdown from './ProjectAccountsDropdown'
import ProjectsDropdown from './ProjectsDropdown'
import { CategorizeAmountFormProps } from './categorizeAmountFormProps'
	@@ -16,13 +20,24 @@ type CategorizeFullAmountFormValues = Pick<
  'projectId' | 'projectAccountId' | 'description'
>

type CategorizeFullAmountReceivedFormValues = Pick<
  CategorizeAmountReceivedForProjectDTO,
  'projectId' | 'description'
>

const CategorizeFullAmountFormValuesSchema: Yup.ObjectSchema<CategorizeFullAmountFormValues> =
  Yup.object({
    projectId: Yup.string().required('Please select a Project'),
    projectAccountId: Yup.string().required('Please select an Account'),
    description: Yup.string().optional(),
  })

const CategorizeFullAmountReceivedFormValuesSchema: Yup.ObjectSchema<CategorizeFullAmountReceivedFormValues> =
  Yup.object({
    projectId: Yup.string().required('Please select a Project'),
    description: Yup.string().optional(),
  })

function CategorizeFullAmountForm({
  transaction,
  projects = FAKE_PROJECTS,
  projectAccounts,
  onClose,
  handleGetTransactions,
}: CategorizeAmountFormProps) {
  const initialValues: CategorizeFullAmountFormValues = {
    projectId: '',
    projectAccountId: '',
    description: '',
  }

  const initialReceivedValues: CategorizeFullAmountReceivedFormValues = {
    projectId: '',
    description: '',
  }

  const handleCategorizeFullAmountFormSubmit = async (
    values: CategorizeFullAmountFormValues,
  ) => {
    const { projectId, projectAccountId, description } = values
    const categorizeAmountForProjectDTO: CategorizeAmountSpentForProjectDTO = {
      projectId,
      projectAccountId,
      amount: transaction.amount.toJSON(),
      sourceTransaction: SourceTransactionMapper.toDTO(transaction),
      description,
    }
    await categorizeAmountSpentForProject(categorizeAmountForProjectDTO)
    onClose()
    handleGetTransactions(transaction.id)
  }

  const handleCategorizeFullAmountReceivedFormSubmit = async (
    values: CategorizeFullAmountReceivedFormValues,
  ) => {
    const { projectId, description } = values
    const categorizeAmountReceivedForProjectDTO: CategorizeAmountReceivedForProjectDTO =
      {
        projectId,
        amount: transaction.amount.toJSON(),
        sourceTransaction: SourceTransactionMapper.toDTO(transaction),
        description,
      }

    await categorizeAmountReceivedForProject(
      categorizeAmountReceivedForProjectDTO,
    )
    onClose()
    handleGetTransactions(transaction.id)
  }

  if (transaction.polarity === 'DEBIT') {
    return (
      <Formik
        initialValues={initialReceivedValues}
        onSubmit={handleCategorizeFullAmountReceivedFormSubmit}
        validationSchema={CategorizeFullAmountReceivedFormValuesSchema}
      >
        <Form>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <ProjectsDropdown projects={projects} fieldName="projectId" />
            </Box>
            <TextField label="Description" fieldName="description" />
          </Box>

          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Form>
      </Formik>
    )
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleCategorizeFullAmountFormSubmit}
      validationSchema={CategorizeFullAmountFormValuesSchema}
    >
      <Form>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <ProjectsDropdown projects={projects} fieldName="projectId" />
            <ProjectAccountsDropdown
              projectAccounts={projectAccounts}
              fieldName="projectAccountId"
            />
          </Box>
          <TextField label="Description" fieldName="description" />
        </Box>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Form>
    </Formik>
  )
}
export default CategorizeFullAmountForm
