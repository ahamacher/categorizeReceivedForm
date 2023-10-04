import {
  CategorizeAmountReceivedForProjectDTO,
  CategorizeAmountSpentForProjectDTO,
} from "@modernfinops/shared"
import { backendAxios } from "@utils/axios"
import { isAxiosError } from "axios"

function getReason(err: unknown) {
  if (isAxiosError(err)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return err.response?.data
  }
  if (err instanceof Error) {
    return err.message
  }
  return "Unknown"
}

export async function categorizeAmountSpentForProject(
  dto: CategorizeAmountSpentForProjectDTO
) {
  try {
    await backendAxios.post("/project-ledger/categorize-amount/spent", dto)
  } catch (err) {
    throw new Error(
      `Failed to Categorize Amount Spent for Project. [Reason: ${JSON.stringify(
        getReason(err)
      )}]`
    )
  }
}

export async function categorizeAmountReceivedForProject(
  dto: CategorizeAmountReceivedForProjectDTO
) {
  try {
    await backendAxios.post("/project-ledger/categorize-amount/received", dto)
  } catch (err) {
    throw new Error(
      `Failed to Categorize Amount Spent for Project. [Reason: ${JSON.stringify(
        getReason(err)
      )}]`
    )
  }
}
