import { createContext, useContext, useEffect, useMemo } from "react"
import MockAdapter from "axios-mock-adapter"
import { backendAxios } from "@utils/axios"
import useLocalStorage from "@utils/useLocalStorage"

import { getConnectedBankAccountsResponse } from "shared/mocks/bankFeed/getConnectedBankAccounts"
import { getProjectProfitLossCalculationsResponse } from "shared/mocks/insights/getProjectProfitLossCalculations"
import { mockGetTransactionList } from "shared/mocks/transactions/getTransactionList"
import { mockGetAllProjectAccountsResponse } from "shared/mocks/transactions/getAllProjectAccounts"
import { mockGetProjectsResponse } from "shared/mocks/projects/getProjects"

const baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL || ""

function commandAndQueriesMapper(): MockAdapter {
  const adapter = new MockAdapter(backendAxios)
  const queries: Record<
    string,
    {
      path: string
      params?: Record<string, unknown>
      response: unknown
    }
  > = {
    status: {
      path: "/status/auth",
      response: {
        status: "ok",
      },
    },
    getProjectProfitLossCalculations: {
      path: "/insights/project-profit-loss",
      response: getProjectProfitLossCalculationsResponse,
    },
    getConnectedBankAccounts: {
      path: "/bank-feed/accounts",
      response: getConnectedBankAccountsResponse,
    },
    getTransactionList: {
      path: "/project-ledger/transaction-list?clientCompanyId=test-client-company-1",
      response: mockGetTransactionList,
    },
    getAllProjectAccounts: {
      path: "/project-account",
      response: mockGetAllProjectAccountsResponse,
      params: {
        clientCompanyId: "test-client-company-1",
      },
    },
    getProjects: {
      path: "/project?clientCompanyId=test-client-company-1",
      response: mockGetProjectsResponse,
    },
  }

  const commands: Record<
    string,
    {
      path: string
      response: unknown
    }
  > = {}

  Object.values(queries).forEach((value) => {
    if (value.path === "/project-account") {
      adapter
        .onGet(`${baseURL}${value.path}`, {
          params: value?.params ? value.params : undefined,
        })
        .reply(() => {
          return [200, value.response]
        })
    } else {
      adapter.onGet(`${baseURL}${value.path}`).reply(200, value.response)
    }
  })

  Object.values(commands).forEach((value) => {
    adapter.onPost(`${baseURL}${value.path}`).reply(200, {
      mock: "mock",
    })
  })

  // Pass through for other unimplemented fields, easier to debug which call is missing / needed
  adapter.onAny().passThrough()

  return adapter
}

interface AppContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
}
// Initialize the context
const AppContext = createContext<AppContextType>({
  isDemoMode: false,
  toggleDemoMode: () => {},
})
export function AppModeProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoModeFromStorage] = useLocalStorage(
    "productionMode",
    false
  )
  // Define a function to toggle demo mode on/off
  const toggleDemoMode = () => {
    setIsDemoModeFromStorage(!isDemoMode)
    window.location.reload()
  }
  const contextValues = useMemo(
    () => ({
      isDemoMode,
      toggleDemoMode,
    }),
    [isDemoMode]
  )
  // Intercept all axios requests and use fake data when in demo mode
  useEffect(() => {
    let mock: MockAdapter
    if (isDemoMode) {
      mock = commandAndQueriesMapper()
    }
    return () => {
      if (isDemoMode) {
        mock.restore()
      }
    }
  }, [isDemoMode])
  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  )
}
// Define a custom hook to access the app context from child components
export const useAppModeContext = () => useContext(AppContext)
