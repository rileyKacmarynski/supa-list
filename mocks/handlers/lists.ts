// @ts-nocheck
import { rest } from 'msw'
import { SUPABASE_URL } from './auth'
import { db } from 'mocks/db'
import { faker } from '@faker-js/faker'

const LIST_URL = `${SUPABASE_URL}/rest/v1/lists`

export const handlers = [
	rest.get(LIST_URL, async (req, res, ctx) => {
		console.log('querying lists', req)

		const lists = db.lists.getAll()
		console.log(lists)

		return res(ctx.status(200), ctx.json(lists))
	}),
	rest.post(LIST_URL, async (req, res, ctx) => {
		console.log('creating list', req)

		const data = await req.json()

		console.log(data)

		db.lists.create({
			...data,
			id: faker.datatype.uuid(),
			created_at: new Date(),
			last_modified: new Date(),
		})

		return res(ctx.status(201))
	}),
	rest.patch(LIST_URL, async (req, res, ctx) => {
		console.log('renaming list', req)

		const id = req.url.searchParams.get('id')?.split('.')[1]
		console.log('id', id)

		const data = await req.json()

		console.log('rename data', data)

		const updated = db.lists.update({
			where: {
				id: {
					equals: id,
				},
			},
			data,
		})

		console.log(updated)

		return res(ctx.status(200), ctx.json(updated))
	}),
	rest.delete(LIST_URL, async (req, res, ctx) => {
		console.log('deleing list', req)

		const id = req.url.searchParams.get('id')?.split('.')[1]

		console.log(id)

		db.lists.delete({
			where: {
				id: {
					equals: id,
				},
			},
		})

		return res(ctx.status(204))
	}),
]
