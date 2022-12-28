import { vi } from 'vitest'

export const useRouter = vi.fn().mockReturnValue({
	push: vi.fn(),
})
