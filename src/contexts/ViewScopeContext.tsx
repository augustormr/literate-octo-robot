import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ViewScope } from '@/types'

interface ViewScopeContextType {
  scope: ViewScope
  setScope: (scope: ViewScope) => void
  toggle: () => void
}

const ViewScopeContext = createContext<ViewScopeContextType | undefined>(undefined)

export function ViewScopeProvider({ children }: { children: ReactNode }) {
  const [scope, setScopeState] = useState<ViewScope>(() => {
    const stored = localStorage.getItem('travelhub-view-scope')
    return (stored as ViewScope) || 'my'
  })

  const setScope = (s: ViewScope) => {
    localStorage.setItem('travelhub-view-scope', s)
    setScopeState(s)
  }

  const toggle = () => {
    setScope(scope === 'my' ? 'family' : 'my')
  }

  return (
    <ViewScopeContext.Provider value={{ scope, setScope, toggle }}>
      {children}
    </ViewScopeContext.Provider>
  )
}

export function useViewScope() {
  const ctx = useContext(ViewScopeContext)
  if (!ctx) throw new Error('useViewScope must be used within ViewScopeProvider')
  return ctx
}
