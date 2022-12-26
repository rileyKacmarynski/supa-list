import { faker } from '@faker-js/faker'
import { ListDetail } from 'lib/ListService'
import { vi } from 'vitest'

const useFetchList = vi.fn().mockReturnValue(() => {
	const userId = faker.datatype.uuid()

	const list: ListDetail = {
		createdAt: faker.date.past(1),
		lastModified: faker.date.recent(1),
		createdBy: userId,
		id: faker.datatype.uuid(),
		name: faker.company.name(),
		contributors: [],
		items: [
			{
				completed: false,
				createdAt: faker.date.recent(),
				createdBy: userId,
				id: faker.datatype.uuid(),
				text: faker.commerce.product(),
				order: 1,
			},
			{
				completed: false,
				createdAt: faker.date.recent(),
				createdBy: userId,
				id: faker.datatype.uuid(),
				text: faker.commerce.product(),
				order: 2,
			},
		],
	}

	return vi.fn().mockReturnValue({
		list,
		isLoading: false,
	})
})

export default useFetchList
