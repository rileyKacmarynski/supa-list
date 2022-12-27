import { vi } from 'vitest'

const useReorderList = vi.fn().mockReturnValue({
	mutate: vi.fn(),
	mutateAsync: vi.fn(),
	isLoading: true,
})

export default useReorderList
