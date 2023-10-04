"use client"

import {
  CategorizeAmountSpentForProjectDTO,
  SourceTransactionMapper,
} from "@modernfinops/shared"
import { AddCircleOutline } from "@mui/icons-material"
import { Button, TextField, Box } from "@ui/common"
import { FieldArray, Form, Formik } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"
import { categorizeAmountSpentForProject } from "../commands"
import { FAKE_PROJECTS } from "../FAKE_DATA"
import AmountInputTypeToggleButton, {
  AmountInputType,
} from "./AmountInputTypeToggleButton"
import DynamicAmountInput from "./DynamicAmountInput"
import ProjectAccountsDropdown from "./ProjectAccountsDropdown"
import ProjectsDropdown from "./ProjectsDropdown"
import { CategorizeAmountFormProps } from "./categorizeAmountFormProps"

type SplitTransactionAmountFormValue = Pick<
  CategorizeAmountSpentForProjectDTO,
  "amount" | "projectAccountId" | "description"
>
type ProjectIdDTO = CategorizeAmountSpentForProjectDTO["projectId"]

interface SplitTransactionAmountFormValues {
  categorizationsByProjectId: [
    ProjectIdDTO,
    SplitTransactionAmountFormValue[]
  ][]
}

const SplitTransactionAmountFormValidationSchema: Yup.ObjectSchema<SplitTransactionAmountFormValues> =
  Yup.object({
    categorizationsByProjectId: Yup.array()
      .of(
        Yup.tuple([
          Yup.string().required("Please select a Project"),
          Yup.array(
            Yup.object({
              amount: Yup.number().required("Please enter an amount"),
              projectAccountId: Yup.string().required(
                "Please select a Project Account"
              ),
              description: Yup.string().optional(),
            })
          ).required("Please split by at least one Project Account."),
        ]).required()
      )
      .required(),
  })

const initialSplitTransactionAmountFormValue: SplitTransactionAmountFormValue =
  {
    amount: 0,
    projectAccountId: "",
    description: "",
  }

const initialValues: SplitTransactionAmountFormValues = {
  categorizationsByProjectId: [["", [initialSplitTransactionAmountFormValue]]],
}

function SplitTransactionAmountSpentForm({
  projects = FAKE_PROJECTS,
  projectAccounts,
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
    values: SplitTransactionAmountFormValues
  ) => {
    const { categorizationsByProjectId } = values
    const categorizations: CategorizeAmountSpentForProjectDTO[] =
      categorizationsByProjectId.flatMap(
        ([projectId, splitAmountsByProjectAccount]) =>
          splitAmountsByProjectAccount.map((splitAmountByProjectAccount) => ({
            projectId,
            sourceTransaction: SourceTransactionMapper.toDTO(transaction),
            ...splitAmountByProjectAccount,
          }))
      )

    await Promise.all(
      categorizations.map((dto) => categorizeAmountSpentForProject(dto))
    )
    onClose()
    handleGetTransactions(transaction.id)
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={SplitTransactionAmountFormValidationSchema}
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
            <Box>
              <FieldArray name="categorizationsByProjectId">
                {(categorizationsByProjectIdArrayHelpers) => (
                  <Box
                    sx={{
                      marginY: 2,
                    }}
                  >
                    {values.categorizationsByProjectId.map(
                      (
                        [_projectId, splitAmountsByProjectAccount],
                        projectIndex
                      ) => (
                        <Box
                          // We are splitting the array structure and have a controlled way to add new objects to the array, so using the array index seems like the only option here
                          // eslint-disable-next-line react/no-array-index-key
                          key={`project-split-inputs-${projectIndex}`}
                          sx={{ marginY: 2 }}
                        >
                          <Box sx={{ width: 2 / 3 }}>
                            <ProjectsDropdown
                              fieldName={`categorizationsByProjectId[${projectIndex}][0]`}
                              projects={projects}
                            />
                          </Box>
                          <FieldArray
                            name={`categorizationsByProjectId[${projectIndex}][1]`}
                          >
                            {(splitAmountsByProjectAccountArrayHelpers) => (
                              <Box
                                sx={{
                                  display: "grid",
                                  gridTemplateColumns: "repeat(3, 1fr)",
                                  gap: 1,
                                  marginY: 1,
                                }}
                              >
                                {splitAmountsByProjectAccount.map(
                                  (
                                    _splitAmountByProjectAccount,
                                    splitAmountIndex
                                  ) => (
                                    <Box
                                      // We are splitting the array structure and have a controlled way to add new objects to the array, so using the array index seems like the only option here
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={`project-account-split-inputs-${splitAmountIndex}`}
                                    >
                                      <DynamicAmountInput
                                        fieldName={`categorizationsByProjectId[${projectIndex}][1][${splitAmountIndex}].amount`}
                                        amountInputType={amountInputType}
                                        transactionAmount={transaction.amount}
                                      />
                                      <ProjectAccountsDropdown
                                        fieldName={`categorizationsByProjectId[${projectIndex}][1][${splitAmountIndex}].projectAccountId`}
                                        projectAccounts={projectAccounts}
                                        sx={{ marginY: 1 }}
                                      />
                                      <TextField
                                        label="Description"
                                        fieldName={`categorizationsByProjectId[${projectIndex}][1][${splitAmountIndex}].description`}
                                        sx={{ width: "100%" }}
                                      />
                                    </Box>
                                  )
                                )}
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Button
                                    startIcon={<AddCircleOutline />}
                                    onClick={() =>
                                      splitAmountsByProjectAccountArrayHelpers.push(
                                        initialSplitTransactionAmountFormValue
                                      )
                                    }
                                    sx={{ maxHeight: "fit-content" }}
                                  >
                                    Split by Project Account
                                  </Button>
                                </Box>
                              </Box>
                            )}
                          </FieldArray>
                        </Box>
                      )
                    )}
                    <Button
                      startIcon={<AddCircleOutline />}
                      onClick={() =>
                        categorizationsByProjectIdArrayHelpers.push(
                          initialValues.categorizationsByProjectId[0]
                        )
                      }
                    >
                      Split by Project
                    </Button>
                  </Box>
                )}
              </FieldArray>
            </Box>
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default SplitTransactionAmountSpentForm
