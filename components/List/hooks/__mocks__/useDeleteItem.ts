import { vi } from 'vitest'

const useDeleteItem = vi.fn().mockReturnValue({
	mutate: vi.fn(),
	mutateAsync: vi.fn(),
	isLoading: true,
})

export default useDeleteItem
