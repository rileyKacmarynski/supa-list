import { faker } from '@faker-js/faker'
import { getRandomInt } from 'lib/utils'

export const makeTestList = (length: number) =>
	Array.from({ length }, (v, i) => ({
		id: (i + 1).toString(),
		name: getTestListName(),
	}))

export const getTestListName = () => faker.lorem.words(getRandomInt(4))
