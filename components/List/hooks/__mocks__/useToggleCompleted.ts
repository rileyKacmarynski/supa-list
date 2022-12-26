import { vi } from 'vitest'

const useToggleCompleted = vi.fn().mockReturnValue({
	mutate: vi.fn(),
	isLoading: true,
})

export default useToggleCompleted
