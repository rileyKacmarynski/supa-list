import { vi } from 'vitest'

const useAddItem = vi.fn().mockReturnValue({
	trigger: vi.fn(),
	isMutating: false,
})

export default useAddItem
