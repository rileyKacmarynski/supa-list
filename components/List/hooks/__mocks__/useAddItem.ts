import { vi } from 'vitest'

const useAddItem = vi.fn().mockReturnValue({
	mutate: vi.fn(),
	isLoading: true,
})

export default useAddItem
