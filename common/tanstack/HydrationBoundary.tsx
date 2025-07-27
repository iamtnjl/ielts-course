'use client'

import { HydrationBoundary as TanStackHydrationBoundary, DehydratedState } from '@tanstack/react-query'

interface HydrationBoundaryProps {
  state: DehydratedState
  children: React.ReactNode
}

export default function HydrationBoundary({ state, children }: HydrationBoundaryProps) {
  return (
    <TanStackHydrationBoundary state={state}>
      {children}
    </TanStackHydrationBoundary>
  )
}