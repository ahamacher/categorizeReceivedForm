"use client"

import { FAKE_PROJECTS } from "../FAKE_DATA"
import SplitTransactionAmountReceivedForm from "./SplitTransactionAmountReceivedForm"
import SplitTransactionAmountSpentForm from "./SplitTransactionAmountSpentForm"
import { CategorizeAmountFormProps } from "./categorizeAmountFormProps"

function SplitTransactionAmountForm({
  projects = FAKE_PROJECTS,
  projectAccounts,
  transaction,
  onClose,
  handleGetTransactions,
}: CategorizeAmountFormProps) {
  const { polarity } = transaction

  if (polarity === "DEBIT") {
    return (
      <SplitTransactionAmountReceivedForm
        projects={projects}
        projectAccounts={projectAccounts}
        transaction={transaction}
        onClose={onClose}
        handleGetTransactions={handleGetTransactions}
      />
    )
  }
  return (
    <SplitTransactionAmountSpentForm
      projectAccounts={projectAccounts}
      projects={projects}
      transaction={transaction}
      onClose={onClose}
      handleGetTransactions={handleGetTransactions}
    />
  )
}

export default SplitTransactionAmountForm
