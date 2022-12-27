import { faker } from '@faker-js/faker'
import { List } from 'lib/ListService'
import { getRandomInt } from 'lib/utils'

const userId = faker.datatype.uuid()

export const makeTestList: (length: number) => List[] = length =>
	Array.from({ length }, (v, i) => ({
		id: (i + 1).toString(),
		name: getTestListName(),
		contributors: [],
		createdAt: faker.date.past(1),
		createdBy: userId,
		items: [],
		lastModified: faker.date.recent(2),
	}))

export const getTestListName = () => faker.lorem.words(getRandomInt(4))
