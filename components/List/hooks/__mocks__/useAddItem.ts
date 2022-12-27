import { vi } from 'vitest'

const useAddItem = vi.fn().mockReturnValue({
	mutate: vi.fn(),
	mutateAsync: vi.fn(),
	isLoading: true,
})

export default useAddItem
