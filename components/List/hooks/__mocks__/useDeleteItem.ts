import { vi } from 'vitest'

const useDeleteItem = vi.fn().mockReturnValue({
	trigger: vi.fn(),
	isMutating: false,
})

export default useDeleteItem
