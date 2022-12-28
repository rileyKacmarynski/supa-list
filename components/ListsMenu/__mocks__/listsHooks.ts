import { faker } from '@faker-js/faker'
import { vi } from 'vitest'

export const useFetchLists = vi.fn()
export const useCreateList = vi.fn().mockReturnValue({
	isLoading: false,
	mutateAsync: vi.fn().mockResolvedValue({
		list: [{ id: faker.datatype.uuid() }],
	}),
	mutate: vi.fn(),
})
export const useRenameList = vi
	.fn()
	.mockReturnValue({ mutate: vi.fn(), mutateAsync: vi.fn(), isLoading: false })
export const useDeleteList = vi
	.fn()
	.mockReturnValue({ mutate: vi.fn(), isLoading: false })
