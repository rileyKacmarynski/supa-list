import { vi } from 'vitest'

export const useFetchLists = vi.fn()
export const useCreateLists = vi.fn()
export const useRenameList = vi
	.fn()
	.mockReturnValue({ trigger: vi.fn(), isMutating: false })
export const useDeleteList = vi
	.fn()
	.mockReturnValue({ trigger: vi.fn(), isMutating: false })
