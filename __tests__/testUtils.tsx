import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from '../ui/Theme'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from 'react-query'

export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>
	  }
	: T

const queryClient = new QueryClient()

export function renderWithProviders(children: React.ReactNode) {
	return render(
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</ThemeProvider>,
	)
}

export function useQueryReturnValue<T>(lists: T) {
	return {
		data: lists,
		isLoading: false,
		error: null,
		isError: false,
		isIdle: false,
		isLoadingError: false,
		isRefetchError: false,
		isSuccess: true,
		status: 'success',
		dataUpdatedAt: 0,
		errorUpdatedAt: 0,
		failureCount: 0,
		errorUpdateCount: 0,
		isFetched: false,
		isFetchedAfterMount: false,
		isFetching: false,
		isPlaceholderData: false,
		isPreviousData: false,
		isRefetching: false,
		isStale: false,
		refetch: vi.fn(),
		remove: vi.fn(),
	} as const
}
