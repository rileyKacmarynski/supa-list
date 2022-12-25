import { vi } from 'vitest'

const useToggleCompleted = vi.fn().mockReturnValue({
	trigger: vi.fn(),
	isMutating: false,
})

export default useToggleCompleted
