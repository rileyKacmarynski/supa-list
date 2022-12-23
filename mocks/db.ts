import { faker } from '@faker-js/faker'
import { factory, manyOf, primaryKey } from '@mswjs/data'

export const db = factory({
	lists: {
		id: primaryKey(faker.datatype.uuid),
		name: String,
		created_at: String,
		last_modified: String,
		created_by: faker.datatype.uuid,
		contributors: () => [faker.datatype.uuid()],
		list_items: manyOf('list_items'),
	},
	list_items: {
		id: primaryKey(faker.datatype.uuid),
		created_at: String,
		created_by: String,
		text: String,
		order: Number,
	},
})
