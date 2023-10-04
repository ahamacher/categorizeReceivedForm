"use client"

import {
  CategorizeAmountReceivedForProjectDTO,
  SourceTransactionMapper,
} from "@modernfinops/shared"
import { AddCircleOutline } from "@mui/icons-material"
import { Button, TextField, Box } from "@ui/common"
import { FieldArray, Form, Formik } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"
import { categorizeAmountReceivedForProject } from "../commands"
import { FAKE_PROJECTS } from "../FAKE_DATA"
import AmountInputTypeToggleButton, {
  AmountInputType,
} from "./AmountInputTypeToggleButton"
import DynamicAmountInput from "./DynamicAmountInput"
import ProjectsDropdown from "./ProjectsDropdown"
import { CategorizeAmountFormProps } from "./categorizeAmountFormProps"

type SplitTransactionAmountReceivedFormValue = Pick<
  CategorizeAmountReceivedForProjectDTO,
  "amount" | "description" | "projectId"
>

type SplitTransactionAmountReceivedFormValues = {
  categorizationsByProjectId: SplitTransactionAmountReceivedFormValue[]
}

const initialSplitTransactionAmountFormValue: SplitTransactionAmountReceivedFormValue =
  {
    amount: 0,
    projectId: "",
    description: "",
  }

const initialValues: SplitTransactionAmountReceivedFormValues = {
  categorizationsByProjectId: [initialSplitTransactionAmountFormValue],
}

const SplitTransactionAmountReceivedFormValidationSchema: Yup.ObjectSchema<SplitTransactionAmountReceivedFormValues> =
  Yup.object({
    categorizationsByProjectId: Yup.array()
      .of(
        Yup.object({
          amount: Yup.number().required("Please enter an amount"),
          projectId: Yup.string().required("Please select a Project"),
          description: Yup.string().optional(),
        }).required()
      )
      .required(),
  })

function SplitTransactionAmountReceivedForm({
  projects = FAKE_PROJECTS,
  transaction,
  onClose,
  handleGetTransactions,
}: CategorizeAmountFormProps) {
  const [amountInputType, setAmountInputType] =
    useState<AmountInputType>("dollars")

  const handleAmountInputTypeChange: React.ComponentProps<
    typeof AmountInputTypeToggleButton
  >["onChange"] = (_event, value) => {
    setAmountInputType(value)
  }

  const handleSplitTransactionAmountFormSubmit = async (
    values: SplitTransactionAmountReceivedFormValues
  ) => {
    const { categorizationsByProjectId } = values
    const categorizations: CategorizeAmountReceivedForProjectDTO[] =
      categorizationsByProjectId.map((categorization) => ({
        amount: categorization.amount,
        projectId: categorization.projectId,
        sourceTransaction: SourceTransactionMapper.toDTO(transaction),
        description: categorization.description,
      }))

    await Promise.all(
      categorizations.map((dto) => categorizeAmountReceivedForProject(dto))
    )
    onClose()
    handleGetTransactions(transaction.id)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={SplitTransactionAmountReceivedFormValidationSchema}
        onSubmit={handleSplitTransactionAmountFormSubmit}
      >
        {({ values }) => (
          <Form>
            <Box>
              <AmountInputTypeToggleButton
                amountInputType={amountInputType}
                onChange={handleAmountInputTypeChange}
              />
            </Box>
            <FieldArray name="categorizationsByProjectId">
              {(arrayHelpers) => (
                <Box
                  sx={{
                    marginY: 2,
                  }}
                >
                  {values.categorizationsByProjectId.map(
                    (_splitAmountByProject, projectIndex) => (
                      <Box
                        // We are splitting the array structure and have a controlled way to add new objects to the array, so using the array index seems like the only option here
                        // eslint-disable-next-line react/no-array-index-key
                        key={`project-split-inputs-${projectIndex}`}
                        sx={{
                          marginY: 2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                        }}
                      >
                        <Box
                          sx={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ProjectsDropdown
                            fieldName={`categorizationsByProjectId[${projectIndex}].projectId`}
                            projects={projects}
                            sx={{ marginRight: 2, width: 2 / 3 }}
                          />
                          <DynamicAmountInput
                            fieldName={`categorizationsByProjectId[${projectIndex}].amount`}
                            amountInputType={amountInputType}
                            transactionAmount={transaction.amount}
                          />
                        </Box>
                        <TextField
                          label="Description"
                          fieldName={`categorizationsByProjectId[${projectIndex}].description`}
                          sx={{
                            marginTop: 1,
                            width: "90%",
                            alignSelf: "flex-end",
                          }}
                        />
                      </Box>
                    )
                  )}
                  <Button
                    startIcon={<AddCircleOutline />}
                    onClick={() =>
                      arrayHelpers.push(initialSplitTransactionAmountFormValue)
                    }
                  >
                    Split By Another Project
                  </Button>
                </Box>
              )}
            </FieldArray>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default SplitTransactionAmountReceivedForm
