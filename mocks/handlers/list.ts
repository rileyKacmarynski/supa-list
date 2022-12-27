// @ts-nocheck
import { rest } from 'msw'
import { SUPABASE_URL } from './auth'
import { db } from 'mocks/db'
import { faker } from '@faker-js/faker'

export const LIST_URL = `${SUPABASE_URL}/rest/v1/list_items`

export const handlers = [
	rest.head(LIST_URL, async (req, res, ctx) => {
		const id = req.url.searchParams.get('list_id')?.split('.')[1]

		console.log('patch id', id)

		const itemCount =
			db.lists.findFirst(l => l.id === id)?.list_items.length ?? 0

		const header = `${0}-${itemCount - 1}/${itemCount}`
		return res(
			ctx.status(200),
			ctx.set({
				'content-range': header,
			}),
		)
	}),
	rest.post(LIST_URL, async (req, res, ctx) => {
		const data = await req.json()

		// reordering results in a post request since it's an upsert

		console.log('save data', data)

		const list = db.lists.findFirst(l => l.id === data.list_id)

		db.lists.update({
			where: {
				id: {
					equals: data.list_id,
				},
			},
			data: {
				...list,
				list_items: [
					...list?.list_items,
					db.list_items.create({
						id: faker.datatype.uuid(),
						created_at: new Date(),
						created_by: faker.datatype.uuid(),
						order: data.order,
						text: data.text,
					}),
				],
			},
		})

		return res(ctx.status(201))
	}),
	rest.delete(LIST_URL, async (req, res, ctx) => {
		const id = req.url.searchParams.get('id')?.split('.')[1]

		console.log('delete id', id)

		const deleted = db.list_items.findFirst(i => i.id === id)

		db.list_items.delete({
			where: {
				id: {
					equals: id,
				},
			},
		})

		return res(ctx.status(200), ctx.json(deleted))
	}),
	rest.patch(LIST_URL, async (req, res, ctx) => {
		const data = await req.json()
		const id = req.url.searchParams.get('id')?.split('.')[1]

		console.log('patch data', data)
		console.log('patch id', id)

		const updated = db.list_items.findFirst(i => i.id === id)

		db.list_items.update({
			where: {
				id: {
					equals: id,
				},
			},
			data: {
				completed: data.completed,
			},
		})

		console.log(updated)

		return res(ctx.status(200), ctx.json(updated))
	}),
]
