import { faker } from '@faker-js/faker'
import { factory, primaryKey } from '@mswjs/data'

export const db = factory({
	lists: {
		id: primaryKey(faker.datatype.uuid),
		name: String,
		created_at: Date,
		last_modified: Date,
		created_by: faker.datatype.uuid,
		contributors: () => [faker.datatype.uuid()],
	},
})
